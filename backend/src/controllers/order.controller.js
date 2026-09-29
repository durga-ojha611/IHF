import Order from '../models/Order.js';
import { getStripe } from '../config/stripe.js';
import {
  validateAndCalculateOrderTotals,
  createStripePaymentIntent
} from '../services/stripe.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

/**
 * Customer: Create Stripe PaymentIntent
 */
export const createOrderPaymentIntent = catchAsync(async (req, res, next) => {
  const { items, customerInfo } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No items provided in cart', 400));
  }

  const { verifiedItems, pricing } = await validateAndCalculateOrderTotals(items);

  const amountInCents = Math.round(pricing.total * 100);

  const paymentIntent = await createStripePaymentIntent({
    amountInCents,
    currency: 'usd',
    metadata: {
      userId: req.user ? (req.user._id || req.user.id || '').toString() : 'guest',
      customerEmail: customerInfo?.email || req.user?.email || 'guest@ihf.com',
      itemCount: verifiedItems.length.toString()
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      verifiedItems,
      pricing
    }
  });
});

/**
 * Customer: Finalize and place order
 */
export const placeOrder = catchAsync(async (req, res, next) => {
  const { items, customerInfo, shippingAddress, paymentInfo } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No items provided for order creation', 400));
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
    return next(new AppError('Complete shipping address is required', 400));
  }

  const { verifiedItems, pricing } = await validateAndCalculateOrderTotals(items);

  const orderData = {
    user: req.user ? req.user._id : null,
    customerInfo: {
      name: customerInfo?.name || req.user?.name || shippingAddress.fullName,
      email: customerInfo?.email || req.user?.email || '',
      phone: customerInfo?.phone || req.user?.phone || shippingAddress.phone || ''
    },
    items: verifiedItems,
    pricing,
    shippingAddress,
    paymentInfo: {
      stripePaymentIntentId: paymentInfo?.stripePaymentIntentId || '',
      stripeClientSecret: paymentInfo?.stripeClientSecret || '',
      paymentStatus: paymentInfo?.paymentStatus || 'pending',
      paymentMethod: paymentInfo?.paymentMethod || 'card',
      paidAt: paymentInfo?.paymentStatus === 'paid' ? Date.now() : null
    },
    fulfillmentStatus: 'Pending'
  };

  const order = await Order.create(orderData);

  res.status(201).json({
    status: 'success',
    message: 'Order created successfully',
    data: {
      order
    }
  });
});

/**
 * Customer: Get current user order history
 */
export const getMyOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Order.find({ user: req.user._id, isDeleted: false }),
    req.query
  )
    .sort()
    .paginate();

  const orders = await features.query;
  const total = await Order.countDocuments({ user: req.user._id, isDeleted: false });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    data: {
      orders
    }
  });
});

/**
 * Customer: Get single order details
 */
export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (!['admin', 'staff', 'superadmin'].includes(req.user.role)) {
    if (!order.user || order.user.toString() !== req.user._id.toString()) {
      return next(new AppError('You do not have permission to view this order', 403));
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Stripe Webhook Handler
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const stripe = getStripe();
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log(`[Stripe Webhook] Payment succeeded for Intent: ${paymentIntent.id}`);

    await Order.findOneAndUpdate(
      { 'paymentInfo.stripePaymentIntentId': paymentIntent.id },
      {
        'paymentInfo.paymentStatus': 'paid',
        'paymentInfo.paidAt': Date.now(),
        fulfillmentStatus: 'Manufacturing'
      }
    );
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await Order.findOneAndUpdate(
      { 'paymentInfo.stripePaymentIntentId': paymentIntent.id },
      { 'paymentInfo.paymentStatus': 'failed' }
    );
  }

  res.status(200).json({ received: true });
};

/**
 * Admin: Get all orders
 */
export const adminGetAllOrders = catchAsync(async (req, res, next) => {
  const query = {};
  if (req.query.fulfillmentStatus) {
    query.fulfillmentStatus = req.query.fulfillmentStatus;
  }
  if (req.query.paymentStatus) {
    query['paymentInfo.paymentStatus'] = req.query.paymentStatus;
  }

  const features = new APIFeatures(Order.find(query), req.query)
    .search(['orderNumber', 'customerInfo.name', 'customerInfo.email'])
    .sort()
    .paginate();

  const orders = await features.query.populate('user', 'name email');
  const total = await Order.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    data: {
      orders
    }
  });
});

/**
 * Admin: Get order by ID with complete manufacturing specifications
 */
export const adminGetOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Admin: Update fulfillment status
 */
export const adminUpdateFulfillmentStatus = catchAsync(async (req, res, next) => {
  const { fulfillmentStatus, trackingNumber, carrier, manufacturingNotes } = req.body;

  const validStatuses = ['Pending', 'Manufacturing', 'Shipped', 'Delivered', 'Cancelled'];
  if (fulfillmentStatus && !validStatuses.includes(fulfillmentStatus)) {
    return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (carrier !== undefined) order.carrier = carrier;
  if (manufacturingNotes !== undefined) order.manufacturingNotes = manufacturingNotes;

  await order.save();

  res.status(200).json({
    status: 'success',
    message: `Order ${order.orderNumber} updated to ${order.fulfillmentStatus}`,
    data: {
      order
    }
  });
});

/**
 * Admin: Soft Delete order
 */
export const adminSoftDeleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: Date.now() },
    { new: true }
  );

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Order ${order.orderNumber} has been archived/soft-deleted.`
  });
});

export default {
  createOrderPaymentIntent,
  placeOrder,
  getMyOrders,
  getOrderById,
  handleStripeWebhook,
  adminGetAllOrders,
  adminGetOrderById,
  adminUpdateFulfillmentStatus,
  adminSoftDeleteOrder
};
