import User from '../models/User.js';
import Order from '../models/Order.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

/**
 * CUSTOMER PROFILE CONTROLLERS
 */

// Update personal details
export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.role) {
    return next(new AppError('This route is not for password or role updates.', 400));
  }

  const allowedFields = ['name', 'phone'];
  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  });

  const userId = req.user._id || req.user.id;
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Customer soft-delete self
export const deleteMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id || req.user.id;
  await User.findByIdAndUpdate(userId, {
    isDeleted: true,
    deletedAt: Date.now()
  });

  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Your account has been successfully deactivated.'
  });
});

// Address Book CRUD
export const getAddresses = catchAsync(async (req, res, next) => {
  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);
  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: {
      addresses: user.addresses
    }
  });
});

export const addAddress = catchAsync(async (req, res, next) => {
  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  });
});

export const updateAddress = catchAsync(async (req, res, next) => {
  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  address.set(req.body);
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      address
    }
  });
});

export const deleteAddress = catchAsync(async (req, res, next) => {
  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  address.deleteOne();
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Address deleted successfully'
  });
});

/**
 * ADMIN USER MANAGEMENT SUITE (`/api/admin/users`)
 */

export const adminGetAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.find({ includeDeleted: req.query.showDeleted === 'true' }),
    req.query
  )
    .search(['name', 'email', 'phone'])
    .filter()
    .sort()
    .paginate();

  const users = await features.query;
  const total = await User.countDocuments({
    includeDeleted: req.query.showDeleted === 'true'
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    total,
    data: {
      users
    }
  });
});

export const adminGetUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id, null, { includeDeleted: true });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const orderHistory = await Order.find({ user: user._id })
    .sort('-createdAt')
    .limit(10);

  res.status(200).json({
    status: 'success',
    data: {
      user,
      orderHistory
    }
  });
});

export const adminUpdateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (!['customer', 'staff', 'admin', 'superadmin'].includes(role)) {
    return next(new AppError('Invalid user role specified', 400));
  }

  if (req.user.id === req.params.id && role !== 'admin') {
    return next(new AppError('You cannot revoke your own admin rights.', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

export const adminSoftDeleteUser = catchAsync(async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return next(new AppError('You cannot delete your own admin account.', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: Date.now() },
    { new: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `User account for ${user.email} has been deactivated.`
  });
});

export const adminRestoreUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, includeDeleted: true }
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: `User account for ${user.email} has been reactivated.`
  });
});

export default {
  updateMe,
  deleteMe,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  adminGetAllUsers,
  adminGetUserById,
  adminUpdateUserRole,
  adminSoftDeleteUser,
  adminRestoreUser
};
