import Category from '../models/Category.js';
import Product from '../models/Product.js';
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

export const getCategoryStorefront = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!category) return next(new AppError('Category not found', 404));
  const subcategories = await Category.find({ parentCategory: category._id, isActive: true }).sort({ displayOrder: 1 }).lean();
  const products = await Product.find({ isActive: true, $or: [{ category: category._id }, { subCategory: { $in: subcategories.map(item => item._id) } }] }).sort({ isFeatured: -1, createdAt: -1 }).limit(12).lean();
  const card = item => ({ slug: item.slug, name: item.name || item.title, image: (typeof item.image === 'string' ? item.image : item.image?.url) || item.images?.find(image => image.isPrimary)?.url || item.images?.[0]?.url || category.storefront?.heroImage || category.image?.url, description: item.description || item.shortDescription || '', price: item.basePrice || 0 });
  res.status(200).json({ status: 'success', data: { category: { slug: category.slug, name: category.name, eyebrow: category.storefront?.eyebrow || `THE ${category.name.toUpperCase()} COLLECTION`, headline: category.storefront?.headline || category.name, description: category.description, heroImage: category.storefront?.heroImage || category.image?.url, guideTitle: category.storefront?.guideTitle || `The ${category.name} Guide`, guideCopy: category.storefront?.guideCopy || `Expert advice for choosing ${category.name.toLowerCase()}.`, subcategories: subcategories.map(card), fabrics: (category.storefront?.materialCards || []).map(card), products: products.map(card) } } });
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
  getCategoryStorefront,
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
};
