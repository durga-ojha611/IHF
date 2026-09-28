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
  const { customerInfo, swatchIds } = req.body;

  if (!customerInfo || !customerInfo.email || !customerInfo.shippingAddress) {
    return next(new AppError('Customer info and shipping address are required', 400));
  }

  if (!Array.isArray(swatchIds) || swatchIds.length === 0) {
    return next(new AppError('Please select at least 1 fabric swatch', 400));
  }

  if (swatchIds.length > 10) {
    return next(new AppError('Sample kits are limited to a maximum of 10 swatches per request', 400));
  }

  const swatches = await Swatch.find({ _id: { $in: swatchIds }, isDeleted: false });

  if (swatches.length === 0) {
    return next(new AppError('No valid swatches found for the provided IDs', 400));
  }

  const swatchItems = swatches.map((s) => ({
    swatch: s._id,
    fabricName: s.fabricName,
    colorName: s.colorName,
    hexCode: s.hexCode,
    image: s.image?.url || ''
  }));

  const swatchOrder = await SwatchOrder.create({
    user: req.user ? req.user._id : null,
    customerInfo,
    swatches: swatchItems,
    status: 'pending'
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
  adminGetAllSwatches,
  adminCreateSwatch,
  adminUpdateSwatch,
  adminDeleteSwatch,
  adminGetSwatchOrders,
  adminUpdateSwatchOrderStatus
};
