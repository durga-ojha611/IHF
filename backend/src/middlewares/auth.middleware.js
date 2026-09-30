import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Protect routes: verifies JWT from httpOnly cookie or Authorization Bearer header
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Check for token in httpOnly cookie first (recommended security standard)
  if (req.cookies && (req.cookies.accessToken || req.cookies.jwt)) {
    token = req.cookies.accessToken || req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // 2. Check for token in Authorization header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  // 3. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'ihf-local-development-secret-change-in-production' : undefined));
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(
        new AppError('Your session has expired. Please log in again.', 401)
      );
    }
    return next(new AppError('Invalid token. Please log in again.', 401));
  }

  // 4. Check if user still exists and is not soft-deleted
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  if (currentUser.isDeleted) {
    return next(
      new AppError('This user account has been deactivated.', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

/**
 * Restrict routes to specific roles (e.g. 'admin', 'staff', 'superadmin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action.',
          403
        )
      );
    }
    next();
  };
};

/**
 * Strict RBAC Verification Alias matching cyber-security standard
 */
export const verifyRoles = (...roles) => authorize(...roles);

/**
 * Optional authentication: attaches req.user if valid token provided, but doesn't block guests
 */
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.cookies && (req.cookies.accessToken || req.cookies.jwt)) {
    token = req.cookies.accessToken || req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'ihf-local-development-secret-change-in-production' : undefined));
      const user = await User.findById(decoded.id);
      if (user && !user.isDeleted) {
        req.user = user;
      }
    } catch {
      // Ignore token errors for optional auth
    }
  }
  next();
};

export default {
  protect,
  authorize,
  verifyRoles,
  optionalAuth
};
