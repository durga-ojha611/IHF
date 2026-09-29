import Swatch from '../models/Swatch.js';
import SwatchOrder from '../models/SwatchOrder.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

/**
 * Public: Get available fabric swatches
 */
export const getSwatches = catchAsync(async (req, res, next) => {
  const query = { isDeleted: false };
  if (req.query.fabric) {
    query.fabricName = new RegExp(req.query.fabric, 'i');
  }

  const features = new APIFeatures(Swatch.find(query), req.query)
    .search(['fabricName', 'colorName', 'texture'])
    .sort()
    .paginate();

  const swatches = await features.query;
  const total = await Swatch.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: swatches.length,
    total,
    data: {
      swatches
    }
  });
});

/**
 * Public: Get swatch by ID
 */
export const getSwatchById = catchAsync(async (req, res, next) => {
  const swatch = await Swatch.findById(req.params.id);
  if (!swatch) {
    return next(new AppError('Fabric swatch not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      swatch
    }
  });
});

/**
 * Public: Request a Fabric Swatch Sample Kit
 */
export const requestSwatchKit = catchAsync(async (req, res, next) => {
  const { customerInfo, swatchIds, customSwatches } = req.body;

  if (!customerInfo || !customerInfo.email || !customerInfo.shippingAddress) {
    return next(new AppError('Customer info and shipping address are required', 400));
  }

  let swatchItems = [];

  if (Array.isArray(swatchIds) && swatchIds.length > 0) {
    if (swatchIds.length > 10) {
      return next(new AppError('Sample kits are limited to a maximum of 10 swatches per request', 400));
    }

    const swatches = await Swatch.find({ _id: { $in: swatchIds }, isDeleted: false });
    if (swatches.length > 0) {
      swatchItems = swatches.map((s) => ({
        swatch: s._id,
        fabricName: s.fabricName,
        colorName: s.colorName,
        hexCode: s.hexCode,
        image: s.image?.url || ''
      }));
    }
  }

  // Fallback to customSwatches array if DB swatches were not matched
  if (swatchItems.length === 0 && Array.isArray(customSwatches) && customSwatches.length > 0) {
    swatchItems = customSwatches.slice(0, 10).map((s) => ({
      swatch: s.swatch || (s._id && s._id.length === 24 ? s._id : '660000000000000000000007'),
      fabricName: s.fabricName || s.name || 'Artisan Fabric',
      colorName: s.colorName || s.color?.name || 'Natural',
      hexCode: s.hexCode || s.color?.hexCode || '#E6D7B9',
      image: s.image?.url || s.image || '/figma/home-02.png'
    }));
  }

  if (swatchItems.length === 0) {
    return next(new AppError('Please select at least 1 valid fabric swatch', 400));
  }

  const swatchOrder = await SwatchOrder.create({
    user: req.user ? req.user._id : null,
    customerInfo: {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone || '',
      shippingAddress: {
        street: customerInfo.shippingAddress.street,
        apartment: customerInfo.shippingAddress.apartment || '',
        city: customerInfo.shippingAddress.city,
        state: customerInfo.shippingAddress.state,
        zipCode: customerInfo.shippingAddress.zipCode,
        country: customerInfo.shippingAddress.country || 'US'
      }
    },
    swatches: swatchItems,
    status: 'pending',
    totalCost: req.body.totalCost || 0,
    carrier: 'USPS',
    trackingNumber: ''
  });

  res.status(201).json({
    status: 'success',
    message: 'Swatch kit sample order requested successfully',
    data: {
      swatchOrder
    }
  });
});

/**
 * Public: Track Swatch Order by orderNumber
 */
export const trackSwatchOrder = catchAsync(async (req, res, next) => {
  const { orderNumber } = req.params;

  const order = await SwatchOrder.findOne({
    orderNumber: { $regex: new RegExp(`^${orderNumber.trim()}$`, 'i') },
    isDeleted: false
  });

  if (!order) {
    return next(new AppError('No swatch order found matching that reference number', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

/**
 * Customer: Get Authenticated User's Swatch Orders
 */
export const getMySwatchOrders = catchAsync(async (req, res, next) => {
  const orders = await SwatchOrder.find({
    user: req.user._id,
    isDeleted: false
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

/**
 * Admin: Get all swatches
 */
export const adminGetAllSwatches = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Swatch.find(), req.query)
    .search(['fabricName', 'colorName'])
    .sort()
    .paginate();

  const swatches = await features.query;
  const total = await Swatch.countDocuments();

  res.status(200).json({
    status: 'success',
    results: swatches.length,
    total,
    data: {
      swatches
    }
  });
});

/**
 * Admin: Create swatch
 */
export const adminCreateSwatch = catchAsync(async (req, res, next) => {
  const newSwatch = await Swatch.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      swatch: newSwatch
    }
  });
});

/**
 * Admin: Update swatch
 */
export const adminUpdateSwatch = catchAsync(async (req, res, next) => {
  const updatedSwatch = await Swatch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedSwatch) {
    return next(new AppError('Swatch not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      swatch: updatedSwatch
    }
  });
});

/**
 * Admin: Soft delete swatch
 */
export const adminDeleteSwatch = catchAsync(async (req, res, next) => {
  const swatch = await Swatch.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!swatch) {
    return next(new AppError('Swatch not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Swatch has been removed'
  });
});

/**
 * Admin: View all swatch kit orders
 */
export const adminGetSwatchOrders = catchAsync(async (req, res, next) => {
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }

  const features = new APIFeatures(SwatchOrder.find(query), req.query)
    .sort()
    .paginate();

  const orders = await features.query.populate('user', 'name email');
  const total = await SwatchOrder.countDocuments(query);

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
 * Admin: Update swatch kit order fulfillment status
 */
export const adminUpdateSwatchOrderStatus = catchAsync(async (req, res, next) => {
  const { status, trackingNumber, carrier, fulfillmentNotes } = req.body;

  const order = await SwatchOrder.findById(req.params.id);
  if (!order) {
    return next(new AppError('Swatch order not found', 404));
  }

  if (status) order.status = status;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (carrier !== undefined) order.carrier = carrier;
  if (fulfillmentNotes !== undefined) order.fulfillmentNotes = fulfillmentNotes;

  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

export default {
  getSwatches,
  getSwatchById,
  requestSwatchKit,
  trackSwatchOrder,
  getMySwatchOrders,
  adminGetAllSwatches,
  adminCreateSwatch,
  adminUpdateSwatch,
  adminDeleteSwatch,
  adminGetSwatchOrders,
  adminUpdateSwatchOrderStatus
};
