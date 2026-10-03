import express from 'express';
import {
  register,
  login,
  googleLogin,
  refreshSession,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authLimiter, requireStrongPassword } from '../middlewares/security.middleware.js';

const router = express.Router();

// Strict Rate-Limited & Sanitized Public Auth Endpoints
router.post('/register', authLimiter, requireStrongPassword, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.post('/refresh', refreshSession);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, requireStrongPassword, resetPassword);

// Authenticated User Routes (Enforced by protect middleware)
router.use(protect);
router.get('/me', getMe);
router.patch('/update-password', requireStrongPassword, updatePassword);

export default router;
