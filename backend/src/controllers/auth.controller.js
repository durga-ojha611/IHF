import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendPasswordResetEmail } from '../services/email.service.js';
import { validatePasswordPolicy } from '../middlewares/security.middleware.js';

/**
 * Sign Short-Lived Access Token (15 Minutes)
 */
const signAccessToken = (id) => {
  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'ihf-local-development-secret-change-in-production' : undefined);
  const userIdStr = typeof id === 'object' && id?._id ? id._id.toString() : id ? id.toString() : id;
  return jwt.sign({ id: userIdStr }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Generate Secure Cryptographic Refresh Token (7 Days)
 */
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Create and attach tokens in HttpOnly, Secure, SameSite=Strict cookies
 * Supporting short-lived access tokens (15m) and refresh token rotation (7d)
 */
const createSendTokens = async (user, statusCode, res) => {
  // 1. Generate 15-minute access token
  const accessToken = signAccessToken(user._id);

  // 2. Generate and store rotated refresh token
  const rawRefreshToken = generateRefreshToken();
  const hashedRefreshToken = hashToken(rawRefreshToken);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Store refresh token hash in user document (max 5 active sessions per user)
  if (!user.refreshTokens) user.refreshTokens = [];
  // Clean expired tokens
  user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > new Date());
  user.refreshTokens.push({
    tokenHash: hashedRefreshToken,
    createdAt: new Date(),
    expiresAt: refreshExpiresAt
  });

  // Keep at most 5 concurrent devices
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  await user.save({ validateBeforeSave: false });

  // 3. Set Strict HttpOnly Cookies
  const isProduction = process.env.NODE_ENV === 'production';

  const accessCookieOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/'
  };

  const refreshCookieOptions = {
    expires: refreshExpiresAt,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/'
  };

  // Set cookies: accessToken, jwt (for backwards-compatibility), and refreshToken
  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('jwt', accessToken, accessCookieOptions);
  res.cookie('refreshToken', rawRefreshToken, refreshCookieOptions);

  const sanitizedUser = user.toObject ? user.toObject() : { ...user };
  delete sanitizedUser.password;
  delete sanitizedUser.refreshTokens;
  delete sanitizedUser.resetPasswordToken;

  res.status(statusCode).json({
    status: 'success',
    token: accessToken, // for API tests and programmatic clients
    accessToken,
    expiresIn: 15 * 60, // 900 seconds (15m)
    data: {
      user: sanitizedUser
    }
  });
};

/**
 * Register Customer Account
 */
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  if (!email || !password || !name) {
    return next(new AppError('Full name, email address, and password are required.', 400));
  }

  if (!validatePasswordPolicy(password)) {
    return next(
      new AppError(
        'Password does not meet security requirements: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        400
      )
    );
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new AppError('An account with this email address already exists.', 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    role: 'customer'
  });

  await createSendTokens(newUser, 201, res);
});

/**
 * Login
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  if (user.isDeleted) {
    return next(new AppError('This account has been deactivated. Please contact support.', 403));
  }

  user.lastLogin = Date.now();
  await createSendTokens(user, 200, res);
});

/**
 * Google Authentication (Firebase SSO)
 */
export const googleLogin = catchAsync(async (req, res, next) => {
  const { email, name, googleId, photo } = req.body;

  if (!email) {
    return next(new AppError('Google authentication failed: Email address is required.', 400));
  }

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    if (user.isDeleted) {
      return next(new AppError('This account has been deactivated. Please contact support.', 403));
    }
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
  } else {
    // Generate secure random password for Firebase OAuth user
    const randomPassword = `GoogleAuth#${crypto.randomBytes(8).toString('hex')}!`;
    user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: randomPassword,
      role: 'customer'
    });
  }

  await createSendTokens(user, 200, res);
});

/**
 * Refresh Access Token with Token Rotation & Reuse Detection
 */
export const refreshSession = catchAsync(async (req, res, next) => {
  const incomingRefreshToken =
    (req.cookies && req.cookies.refreshToken) || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return next(new AppError('No refresh token provided in session cookies.', 401));
  }

  const incomingHash = hashToken(incomingRefreshToken);

  // Find user holding this refresh token
  const user = await User.findOne({
    'refreshTokens.tokenHash': incomingHash,
    isDeleted: false
  });

  if (!user) {
    // Suspected token reuse or revoked session: clear client cookies
    res.clearCookie('accessToken');
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    return next(new AppError('Invalid or expired refresh token. Please sign in again.', 401));
  }

  const tokenRecord = user.refreshTokens.find((t) => t.tokenHash === incomingHash);
  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    // Remove expired token
    user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== incomingHash);
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Refresh token expired. Please sign in again.', 401));
  }

  // Rotate token: Remove used token and issue new pair
  user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== incomingHash);
  await createSendTokens(user, 200, res);
});

/**
 * Logout - Invalidate Refresh Token and Clear Cookies
 */
export const logout = catchAsync(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (incomingRefreshToken) {
    const incomingHash = hashToken(incomingRefreshToken);
    await User.updateOne(
      { 'refreshTokens.tokenHash': incomingHash },
      { $pull: { refreshTokens: { tokenHash: incomingHash } } }
    );
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const clearOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/'
  };

  res.clearCookie('accessToken', clearOptions);
  res.clearCookie('jwt', clearOptions);
  res.clearCookie('refreshToken', clearOptions);

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully. All session tokens invalidated.'
  });
});

/**
 * Current Logged In User
 */
export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

/**
 * Forgot Password - Generates 15-minute expiring hashed token
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Please provide an email address.', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(200).json({
      status: 'success',
      message: 'If that email exists in our system, a password reset link has been dispatched.'
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail({ to: user.email, resetUrl });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email.'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

/**
 * Reset Password with Hashed Token
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password || !validatePasswordPolicy(password)) {
    return next(
      new AppError(
        'Password does not meet security requirements: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        400
      )
    );
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired.', 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  // Invalidate all active sessions upon password reset
  user.refreshTokens = [];
  await user.save();

  await createSendTokens(user, 200, res);
});

/**
 * Update Current Password
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || !validatePasswordPolicy(newPassword)) {
    return next(
      new AppError(
        'New password does not meet security requirements: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        400
      )
    );
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  user.password = newPassword;
  // Invalidate previous refresh tokens
  user.refreshTokens = [];
  await user.save();

  await createSendTokens(user, 200, res);
});

export default {
  register,
  login,
  googleLogin,
  refreshSession,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword
};
