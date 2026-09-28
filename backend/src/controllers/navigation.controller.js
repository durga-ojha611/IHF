import Navigation from '../models/Navigation.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Public: Get active site navigation tree
 */
export const getPublicNavigation = catchAsync(async (req, res, next) => {
  const navItems = await Navigation.find({
    parent: null,
    isActive: true
  })
    .sort('displayOrder')
    .populate({
      path: 'children',
      options: { sort: { displayOrder: 1 } }
    });

  res.status(200).json({
    status: 'success',
    results: navItems.length,
    data: {
      navigation: navItems
    }
  });
});

/**
 * Admin: Get all navigation items
 */
export const adminGetNavigation = catchAsync(async (req, res, next) => {
  const items = await Navigation.find()
    .sort('displayOrder')
    .populate('children');

  res.status(200).json({
    status: 'success',
    results: items.length,
    data: {
      navigation: items
    }
  });
});

/**
 * Admin: Create navigation item
 */
export const adminCreateNavigation = catchAsync(async (req, res, next) => {
  const newItem = await Navigation.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      navigation: newItem
    }
  });
});

/**
 * Admin: Update navigation item
 */
export const adminUpdateNavigation = catchAsync(async (req, res, next) => {
  const updatedItem = await Navigation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedItem) {
    return next(new AppError('Navigation item not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      navigation: updatedItem
    }
  });
});

/**
 * Admin: Delete navigation item
 */
export const adminDeleteNavigation = catchAsync(async (req, res, next) => {
  const item = await Navigation.findById(req.params.id);
  if (!item) {
    return next(new AppError('Navigation item not found', 404));
  }

  await Navigation.updateMany(
    { $or: [{ _id: item._id }, { parent: item._id }] },
    { isDeleted: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Navigation item and related children deleted'
  });
});

/**
 * Admin: Reorder navigation items
 */
export const adminReorderNavigation = catchAsync(async (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return next(new AppError('Please provide an array of navigation items with order', 400));
  }

  const updates = items.map((item) =>
    Navigation.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
  );

  await Promise.all(updates);

  res.status(200).json({
    status: 'success',
    message: 'Navigation order updated successfully'
  });
});

export default {
  getPublicNavigation,
  adminGetNavigation,
  adminCreateNavigation,
  adminUpdateNavigation,
  adminDeleteNavigation,
  adminReorderNavigation
};
