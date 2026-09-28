import Category from '../models/Category.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Public: Get categories tree
 */
export const getPublicCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({
    parentCategory: null,
    isActive: true
  })
    .sort('displayOrder')
    .populate({
      path: 'subcategories',
      options: { sort: { displayOrder: 1 } }
    });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

/**
 * Public: Get single category by slug
 */
export const getCategoryBySlug = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true
  }).populate('subcategories');

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Admin: Get all categories
 */
export const adminGetAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find()
    .sort('displayOrder')
    .populate('parentCategory', 'name slug');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

/**
 * Admin: Create category or subcategory
 */
export const adminCreateCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory
    }
  });
});

/**
 * Admin: Update category
 */
export const adminUpdateCategory = catchAsync(async (req, res, next) => {
  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedCategory) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category: updatedCategory
    }
  });
});

/**
 * Admin: Soft Delete Category
 */
export const adminDeleteCategory = catchAsync(async (req, res, next) => {
  const category = req.categoryToDelete;

  category.isDeleted = true;
  category.deletedAt = Date.now();
  await category.save();

  res.status(200).json({
    status: 'success',
    message: `Category "${category.name}" has been soft-deleted.`
  });
});

export default {
  getPublicCategories,
  getCategoryBySlug,
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
};
