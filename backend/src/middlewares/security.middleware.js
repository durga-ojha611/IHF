import rateLimit from 'express-rate-limit';
import validator from 'validator';
import mongoose from 'mongoose';
import AppError from '../utils/appError.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * 1. STRICT RATE LIMITING FOR AUTHENTICATION & PASSWORD RESET
 * Protects against brute-force attacks and credential stuffing
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 requests per IP per 15 minutes on sensitive auth routes
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
  }
});

/**
 * 2. STRICT PASSWORD POLICY VALIDATOR
 * Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
 */
export const validatePasswordPolicy = (password) => {
  if (!password || typeof password !== 'string') return false;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
};

export const requireStrongPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next(new AppError('Password is required.', 400));
  }

  if (!validatePasswordPolicy(password)) {
    return next(
      new AppError(
        'Password does not meet security requirements: Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        400
      )
    );
  }
  next();
};

/**
 * 3. RECURSIVE XSS INPUT SANITIZATION
 * Deeply sanitizes string values in body, query, and params to neutralize script tags & javascript: URIs
 */
const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    // Strip <script> and dangerous attributes
    let sanitized = val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:[^"']*/gi, '')
      .replace(/on\w+\s*=/gi, '');
    return validator.trim(sanitized);
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
    const cleaned = {};
    for (const key of Object.keys(val)) {
      cleaned[key] = sanitizeValue(val[key]);
    }
    return cleaned;
  }
  return val;
};

export const xssSanitizer = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
};

/**
 * 4. STRICT RBAC (ROLE-BASED ACCESS CONTROL)
 * Verifies that the authenticated user possesses one of the required administrative roles
 */
export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Unauthorized: Authentication required before checking roles.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden: Insufficient privileges. Required role: [${allowedRoles.join(', ')}]. Your role: [${req.user.role}].`,
          403
        )
      );
    }
    next();
  };
};

/**
 * 5. IDOR (INSECURE DIRECT OBJECT REFERENCE) OWNERSHIP VERIFICATION
 * Ensures the resource owner matches req.user._id, while granting bypass to elevated admin roles
 */
export const checkOwnership = (Model, userField = 'user', idParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParam];

      if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
        return next(new AppError('Invalid resource identifier.', 400));
      }

      const resource = await Model.findById(resourceId);
      if (!resource) {
        return next(new AppError('Resource not found.', 404));
      }

      // Admins and Superadmins have elevated administrative bypass
      if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        req.resource = resource;
        return next();
      }

      // Check user ownership
      const ownerId = resource[userField] ? resource[userField].toString() : null;
      const currentUserId = req.user._id ? req.user._id.toString() : null;

      if (!ownerId || ownerId !== currentUserId) {
        return next(new AppError('Forbidden: You do not have permission to access or modify this resource.', 403));
      }

      req.resource = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * 6. AUDIT ACTIVITY LOGGER MIDDLEWARE
 * Logs high-impact administrative actions (price changes, status updates, resource deletions)
 */
export const logAdminActivity = (action, resourceName) => {
  return async (req, res, next) => {
    // Intercept response finish event to record successful modifications
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          await ActivityLog.create({
            user: req.user._id,
            userEmail: req.user.email,
            userRole: req.user.role,
            action,
            resource: resourceName,
            resourceId: req.params.id || req.body._id || null,
            details: {
              method: req.method,
              url: req.originalUrl,
              bodySnippet: req.body ? Object.keys(req.body) : [],
              statusCode: res.statusCode
            },
            ipAddress: req.ip || req.connection?.remoteAddress || '',
            userAgent: req.get('user-agent') || ''
          });
        } catch (logErr) {
          console.error('[Audit Logger Error]: Failed to write activity log:', logErr.message);
        }
      }
    });
    next();
  };
};

export default {
  authLimiter,
  validatePasswordPolicy,
  requireStrongPassword,
  xssSanitizer,
  verifyRoles,
  checkOwnership,
  logAdminActivity
};
