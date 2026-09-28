import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Authenticated auth routes
router.use(protect);
router.get('/me', getMe);
router.patch('/update-password', updatePassword);

export default router;
