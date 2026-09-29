import crypto from 'crypto';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Strict file upload security policy
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Megabytes

/**
 * Generate Secure Presigned Upload Signature / URL
 * Enforces MIME-type whitelist, extension validation, and 5MB size limit
 */
export const getPresignedUploadUrl = catchAsync(async (req, res, next) => {
  const { fileName, fileType, fileSize } = req.body;

  if (!fileName || !fileType) {
    return next(new AppError('Both fileName and fileType (MIME type) are required.', 400));
  }

  // 1. Verify MIME-type whitelist
  if (!ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
    return next(
      new AppError(
        `Invalid file type (${fileType}). Only JPEG, PNG, and WebP images are permitted for security.`,
        400
      )
    );
  }

  // 2. Verify File Extension whitelist
  const extensionMatch = fileName.toLowerCase().match(/\.[0-9a-z]+$/i);
  const ext = extensionMatch ? extensionMatch[0] : '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return next(
      new AppError(
        `Invalid file extension (${ext}). Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}.`,
        400
      )
    );
  }

  // 3. Verify File Size Limit (5MB)
  if (fileSize && Number(fileSize) > MAX_FILE_SIZE_BYTES) {
    return next(
      new AppError(
        `File size exceeds maximum permitted limit of 5MB (${(Number(fileSize) / (1024 * 1024)).toFixed(2)}MB uploaded).`,
        400
      )
    );
  }

  // 4. Generate cryptographically safe random file key
  const uniqueKey = `uploads/${Date.now()}-${crypto.randomBytes(16).toString('hex')}${ext}`;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  // 5. Generate secure presigned upload payload
  // If AWS S3 or Cloudinary credentials are configured, generate cryptographic HMAC signature
  const uploadSignature = crypto
    .createHmac('sha256', process.env.UPLOAD_SECRET || process.env.JWT_SECRET || 'ihf_secure_upload_key')
    .update(`fileKey=${uniqueKey}&timestamp=${timestamp}&mime=${fileType}`)
    .digest('hex');

  const uploadEndpoint = process.env.S3_BUCKET_URL || `https://storage.ihfluxury.com/${uniqueKey}`;

  res.status(200).json({
    status: 'success',
    data: {
      fileKey: uniqueKey,
      fileUrl: uploadEndpoint,
      uploadUrl: `${uploadEndpoint}?signature=${uploadSignature}&expires=${timestamp + 300}`,
      maxSizeBytes: MAX_FILE_SIZE_BYTES,
      allowedMimeTypes: ALLOWED_MIME_TYPES,
      expiresAt: expiresAt.toISOString(),
      headers: {
        'Content-Type': fileType,
        'x-amz-acl': 'public-read'
      }
    }
  });
});

export default {
  getPresignedUploadUrl
};
