import express from 'express';
import {
  getSwatches,
  getSwatchById,
  requestSwatchKit,
  trackSwatchOrder,
  getMySwatchOrders
} from '../controllers/swatch.controller.js';
import { optionalAuth, protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getSwatches);
router.get('/my-orders', protect, getMySwatchOrders);
router.get('/track/:orderNumber', trackSwatchOrder);
router.get('/:id', getSwatchById);

// Public or authenticated swatch kit sample order request
router.post('/request', optionalAuth, requestSwatchKit);

export default router;
