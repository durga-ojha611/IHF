import express from 'express';
import { getPresignedUploadUrl } from '../controllers/upload.controller.js';
import { protect, verifyRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Enforce authentication & admin authorization for asset upload presigning
router.use(protect);
router.post('/presigned-url', verifyRoles('admin', 'staff', 'superadmin'), getPresignedUploadUrl);

export default router;
