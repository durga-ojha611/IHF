import express from 'express';
import {
  createOrderPaymentIntent,
  placeOrder,
  getMyOrders,
  getOrderById
} from '../controllers/order.controller.js';
import { protect, optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public or logged-in checkout initiation
router.post('/create-payment-intent', optionalAuth, createOrderPaymentIntent);
router.post('/', optionalAuth, placeOrder);

// Authenticated customer order history
router.use(protect);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

export default router;
