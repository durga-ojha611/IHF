import CustomizerRule from '../models/CustomizerRule.js';
import { calculateCustomCurtainPrice } from '../services/customizer.service.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Public: Get active customizer rules and pricing options
 */
export const getActiveRules = catchAsync(async (req, res, next) => {
  const rule = await CustomizerRule.findOne({ isActive: true });

  if (!rule) {
    return next(new AppError('No active customizer configuration found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rule
    }
  });
});

/**
 * Public: Dynamic Price Calculation API
 */
export const calculatePrice = catchAsync(async (req, res, next) => {
  const {
    productId,
    width,
    height,
    fullnessId,
    liningId,
    pleatId,
    hardwareIds,
    panelConfiguration,
    quantity,
    ruleKey
  } = req.body;

  if (!productId) {
    return next(new AppError('Product ID is required for custom price calculation', 400));
  }

  if (!width || !height) {
    return next(new AppError('Both width and height dimensions are required', 400));
  }

  const result = await calculateCustomCurtainPrice({
    productId,
    width,
    height,
    fullnessId,
    liningId,
    pleatId,
    hardwareIds,
    panelConfiguration,
    quantity,
    ruleKey
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * Admin: Get all customizer rule sets
 */
export const adminGetAllRules = catchAsync(async (req, res, next) => {
  const rules = await CustomizerRule.find();

  res.status(200).json({
    status: 'success',
    results: rules.length,
    data: {
      rules
    }
  });
});

/**
 * Admin: Get single rule set by ID
 */
export const adminGetRuleById = catchAsync(async (req, res, next) => {
  const rule = await CustomizerRule.findById(req.params.id);
  if (!rule) {
    return next(new AppError('Customizer rule not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rule
    }
  });
});

/**
 * Admin: Create customizer rule set
 */
export const adminCreateRule = catchAsync(async (req, res, next) => {
  const rule = await CustomizerRule.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      rule
    }
  });
});

/**
 * Admin: Update customizer rule set
 */
export const adminUpdateRule = catchAsync(async (req, res, next) => {
  const rule = await CustomizerRule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!rule) {
    return next(new AppError('Customizer rule not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rule
    }
  });
});

/**
 * Admin: Delete customizer rule set
 */
export const adminDeleteRule = catchAsync(async (req, res, next) => {
  const rule = await CustomizerRule.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, isActive: false },
    { new: true }
  );

  if (!rule) {
    return next(new AppError('Customizer rule not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Customizer rule set deactivated'
  });
});

export default {
  getActiveRules,
  calculatePrice,
  adminGetAllRules,
  adminGetRuleById,
  adminCreateRule,
  adminUpdateRule,
  adminDeleteRule
};
