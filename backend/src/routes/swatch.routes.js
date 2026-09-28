import express from 'express';
import {
  getSwatches,
  getSwatchById,
  requestSwatchKit
} from '../controllers/swatch.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getSwatches);
router.get('/:id', getSwatchById);

// Public or authenticated swatch kit sample order request
router.post('/request', optionalAuth, requestSwatchKit);

export default router;
