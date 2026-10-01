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
  const { items, customerInfo, shippingAddress, paymentInfo, orderType } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No items provided for order creation', 400));
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
    return next(new AppError('Complete shipping address is required', 400));
  }

  let verifiedItems = [];
  let pricing = null;

  try {
    const calculation = await validateAndCalculateOrderTotals(items);
    verifiedItems = calculation.verifiedItems;
    pricing = calculation.pricing;
  } catch (err) {
    // Graceful fallback for mock mode or direct item specifications
    let subtotal = 0;
    verifiedItems = items.map((it) => {
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      const unit = Number(it.unitPrice || it.price || 185);
      const lineTotal = Math.round(unit * qty * 100) / 100;
      subtotal += lineTotal;

      return {
        itemType: it.itemType || 'custom_curtain',
        product: it.productId || it.product || null,
        title: it.title || it.name || 'Bespoke Custom Drapery Panel',
        image: it.image || '',
        quantity: qty,
        unitPrice: unit,
        totalPrice: lineTotal,
        customCurtainSpecs: it.customCurtainSpecs || (it.width ? {
          width: { raw: String(it.width), decimal: parseFloat(it.width) || 54, formatted: `${it.width}"` },
          height: { raw: String(it.height), decimal: parseFloat(it.height) || 96, formatted: `${it.height}"` },
          fullness: { id: it.fullnessId || 'standard', label: '2.0x Standard Fullness', factor: 2.0 },
          lining: { id: it.liningId || 'privacy', name: 'Standard Privacy Lining', type: 'privacy' },
          pleatHeader: { id: it.pleatId || 'pinch-pleat', name: 'Three-Finger French Pinch Pleat' },
          hardware: it.hardware || [],
          color: { name: it.colorName || 'Pearl Silk', hexCode: it.hexCode || '#F5F2EB' },
          fabricType: it.fabricType || 'Belgian Linen',
          fabricName: it.fabricName || 'Pure Belgian Linen',
          roomLabel: it.roomLabel || 'Living Room',
          motorization: it.motorization || 'Manual',
          panelConfiguration: it.panelConfiguration || 'pair'
        } : null)
      };
    });

    const shipping = subtotal > 500 ? 0 : 35;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    pricing = {
      subtotal,
      shipping,
      tax,
      discount: 0,
      total: Math.round((subtotal + shipping + tax) * 100) / 100
    };
  }

  // Derive order type
  let derivedType = orderType;
  if (!derivedType) {
    if (verifiedItems.some((i) => i.itemType === 'custom_curtain')) {
      derivedType = 'Custom Drapery';
    } else if (verifiedItems.some((i) => i.itemType === 'swatch_kit')) {
      derivedType = 'Swatch Order';
    } else {
      derivedType = 'Curtains & Drapes';
    }
  }

  const orderData = {
    user: req.user ? req.user._id : null,
    customerInfo: {
      name: customerInfo?.name || req.user?.name || shippingAddress.fullName,
      email: customerInfo?.email || req.user?.email || 'customer@example.com',
      phone: customerInfo?.phone || req.user?.phone || shippingAddress.phone || ''
    },
    items: verifiedItems,
    pricing,
    shippingAddress,
    orderType: derivedType,
    paymentInfo: {
      stripePaymentIntentId: paymentInfo?.stripePaymentIntentId || '',
      stripeClientSecret: paymentInfo?.stripeClientSecret || '',
      paymentStatus: paymentInfo?.paymentStatus || 'pending',
      paymentMethod: paymentInfo?.paymentMethod || 'card',
      paidAt: paymentInfo?.paymentStatus === 'paid' ? Date.now() : null
    },
    fulfillmentStatus: 'Pending',
    isArchived: false,
    isDeleted: false
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
 * Admin: Get all orders with rich filtering, search, and tab segmentation
 */
export const adminGetAllOrders = catchAsync(async (req, res, next) => {
  const query = {};

  // Tab filter
  if (req.query.tab === 'archived') {
    query.isArchived = true;
  } else if (req.query.tab === 'draft') {
    query.isArchived = false;
    query['paymentInfo.paymentStatus'] = 'pending';
  } else if (req.query.tab === 'active') {
    query.isArchived = false;
    query.fulfillmentStatus = { $nin: ['Delivered', 'Cancelled'] };
  } else if (req.query.isArchived === 'true') {
    query.isArchived = true;
  } else if (req.query.isArchived === 'all') {
    // include both
  } else {
    query.isArchived = false;
  }

  // Explicit status filters
  if (req.query.fulfillmentStatus && req.query.fulfillmentStatus !== 'all') {
    query.fulfillmentStatus = req.query.fulfillmentStatus;
  }
  if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
    query['paymentInfo.paymentStatus'] = req.query.paymentStatus;
  }
  if (req.query.orderType && req.query.orderType !== 'all') {
    query.orderType = req.query.orderType;
  }

  const features = new APIFeatures(Order.find(query), req.query)
    .search(['orderNumber', 'customerInfo.name', 'customerInfo.email', 'customerInfo.phone', 'orderType'])
    .sort()
    .paginate();

  const orders = await features.query.populate('user', 'name email');
  const total = await Order.countDocuments(query);

  // Tab statistics
  const [activeCount, draftCount, archivedCount, totalCount] = await Promise.all([
    Order.countDocuments({ isArchived: false, fulfillmentStatus: { $nin: ['Delivered', 'Cancelled'] } }),
    Order.countDocuments({ isArchived: false, 'paymentInfo.paymentStatus': 'pending' }),
    Order.countDocuments({ isArchived: true }),
    Order.countDocuments({ isArchived: false })
  ]);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    counts: {
      all: totalCount,
      active: activeCount,
      draft: draftCount,
      archived: archivedCount
    },
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
 * Admin: Create manual order
 */
export const adminCreateManualOrder = catchAsync(async (req, res, next) => {
  const {
    customerInfo,
    shippingAddress,
    items,
    orderType,
    pricing,
    paymentStatus,
    paymentMethod,
    fulfillmentStatus,
    carrier,
    trackingNumber,
    manufacturingNotes
  } = req.body;

  if (!customerInfo || !customerInfo.name || !customerInfo.email) {
    return next(new AppError('Customer name and email are required', 400));
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError('At least one item is required for manual order', 400));
  }

  const processedItems = items.map((item) => {
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const totalPrice = Math.round(qty * unitPrice * 100) / 100;

    return {
      itemType: item.itemType || 'custom_curtain',
      product: item.product || null,
      title: item.title || 'Bespoke Custom Window Treatment',
      image: item.image || '',
      quantity: qty,
      unitPrice,
      totalPrice,
      customCurtainSpecs: item.customCurtainSpecs || (item.width ? {
        width: {
          raw: String(item.width),
          decimal: parseFloat(item.width) || 54,
          formatted: `${item.width}"`
        },
        height: {
          raw: String(item.height),
          decimal: parseFloat(item.height) || 96,
          formatted: `${item.height}"`
        },
        fullness: {
          id: item.fullnessId || 'standard',
          label: item.fullnessLabel || '2.0x Standard Fullness',
          factor: parseFloat(item.fullnessFactor) || 2.0
        },
        lining: {
          id: item.liningId || 'privacy',
          name: item.liningName || 'Standard Privacy Lining',
          type: item.liningType || 'privacy'
        },
        pleatHeader: {
          id: item.pleatId || 'pinch-pleat',
          name: item.pleatName || 'French Pinch Pleat'
        },
        hardware: item.hardware || [],
        color: {
          name: item.colorName || 'Default Tone',
          hexCode: item.hexCode || ''
        },
        fabricType: item.fabricType || 'Belgian Linen',
        fabricName: item.fabricName || 'Pure Belgian Linen',
        fabricCode: item.fabricCode || '',
        roomLabel: item.roomLabel || 'Living Room',
        motorization: item.motorization || 'Manual',
        notes: item.notes || '',
        panelConfiguration: item.panelConfiguration || 'pair',
        priceBreakdown: item.priceBreakdown || {
          calculatedUnitPrice: unitPrice
        }
      } : null),
      swatchKitDetails: item.swatchKitDetails || []
    };
  });

  // Calculate pricing
  const subtotal = processedItems.reduce((sum, it) => sum + it.totalPrice, 0);
  const shipping = pricing?.shipping !== undefined ? parseFloat(pricing.shipping) : (subtotal > 500 ? 0 : 45);
  const tax = pricing?.tax !== undefined ? parseFloat(pricing.tax) : Math.round(subtotal * 0.08 * 100) / 100;
  const discount = pricing?.discount !== undefined ? parseFloat(pricing.discount) : 0;
  const total = pricing?.total !== undefined ? parseFloat(pricing.total) : Math.round((subtotal + shipping + tax - discount) * 100) / 100;

  const randSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `IHF-${randSuffix}`;

  const manualOrder = await Order.create({
    orderNumber,
    customerInfo: {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone || ''
    },
    items: processedItems,
    orderType: orderType || (processedItems.some(i => i.itemType === 'custom_curtain') ? 'Custom Drapery' : 'Curtains & Drapes'),
    pricing: {
      subtotal,
      shipping,
      tax,
      discount,
      total
    },
    shippingAddress: shippingAddress || {
      fullName: customerInfo.name,
      street: '100 Luxury Avenue',
      city: 'New Delhi',
      state: 'DL',
      zipCode: '110001',
      country: 'IN',
      phone: customerInfo.phone || ''
    },
    paymentInfo: {
      paymentStatus: paymentStatus || 'pending',
      paymentMethod: paymentMethod || 'manual_invoice',
      paidAt: paymentStatus === 'paid' ? Date.now() : null
    },
    fulfillmentStatus: fulfillmentStatus || 'Pending',
    carrier: carrier || 'FedEx Custom Freight',
    trackingNumber: trackingNumber || '',
    manufacturingNotes: manufacturingNotes || '',
    isArchived: false,
    isDeleted: false
  });

  res.status(201).json({
    status: 'success',
    message: `Manual order #${manualOrder.orderNumber} created successfully`,
    data: {
      order: manualOrder
    }
  });
});

/**
 * Admin: Update order (fulfillment, payment, carrier, notes, address)
 */
export const adminUpdateOrder = catchAsync(async (req, res, next) => {
  const {
    fulfillmentStatus,
    paymentStatus,
    carrier,
    trackingNumber,
    manufacturingNotes,
    shippingAddress,
    customerInfo
  } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (fulfillmentStatus) {
    order.fulfillmentStatus = fulfillmentStatus;
  }

  if (paymentStatus) {
    order.paymentInfo = order.paymentInfo || {};
    order.paymentInfo.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid' && !order.paymentInfo.paidAt) {
      order.paymentInfo.paidAt = Date.now();
    }
  }

  if (carrier !== undefined) order.carrier = carrier;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (manufacturingNotes !== undefined) order.manufacturingNotes = manufacturingNotes;

  if (shippingAddress) {
    order.shippingAddress = {
      ...order.shippingAddress?.toObject?.() || order.shippingAddress,
      ...shippingAddress
    };
  }

  if (customerInfo) {
    order.customerInfo = {
      ...order.customerInfo?.toObject?.() || order.customerInfo,
      ...customerInfo
    };
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    message: `Order #${order.orderNumber} updated successfully`,
    data: {
      order
    }
  });
});

/**
 * Admin: Update fulfillment status specifically
 */
export const adminUpdateFulfillmentStatus = catchAsync(async (req, res, next) => {
  const { fulfillmentStatus, trackingNumber, carrier, manufacturingNotes } = req.body;

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
    message: `Order #${order.orderNumber} fulfillment updated`,
    data: {
      order
    }
  });
});

/**
 * Admin: Soft Delete / Archive order
 */
export const adminSoftDeleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { isArchived: true, isDeleted: true, deletedAt: Date.now() },
    { new: true }
  );

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Order #${order.orderNumber} archived successfully.`
  });
});

/**
 * Admin: Restore archived order
 */
export const adminRestoreOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { isArchived: false, isDeleted: false, deletedAt: null },
    { new: true }
  );

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `Order #${order.orderNumber} restored successfully.`,
    data: {
      order
    }
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
  adminCreateManualOrder,
  adminUpdateOrder,
  adminUpdateFulfillmentStatus,
  adminSoftDeleteOrder,
  adminRestoreOrder
};
