import Product from '../models/Product.js';
import Category from '../models/Category.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

/**
 * Public: Get all products with dynamic filters, search, sort, and pagination
 */
export const getAllProducts = catchAsync(async (req, res, next) => {
  const filterQuery = { isActive: true, isDeleted: false };

  // Category slug filter
  if (req.query.category) {
    const categoryDoc = await Category.findOne({ slug: req.query.category });
    if (categoryDoc) {
      const childCategories = await Category.find({ parentCategory: categoryDoc._id }).select('_id');
      const categoryIds = [categoryDoc._id, ...childCategories.map((c) => c._id)];
      filterQuery.$or = [{ category: { $in: categoryIds } }, { subCategory: { $in: categoryIds } }];
    }
  }
  if (req.query.subcategory) {
    const subCategoryDoc = await Category.findOne({ slug: req.query.subcategory });
    if (subCategoryDoc) filterQuery.subCategory = subCategoryDoc._id;
  }

  // Multi-select fabrics
  if (req.query.fabrics) {
    const fabricList = req.query.fabrics.split(',').map((f) => f.trim().toLowerCase());
    filterQuery.fabricType = { $in: fabricList };
  }

  // Multi-select styles
  if (req.query.styles) {
    const styleList = req.query.styles.split(',').map((s) => s.trim().toLowerCase());
    filterQuery.styles = { $in: styleList };
  }

  // Multi-select features
  if (req.query.features) {
    const featureList = req.query.features.split(',').map((f) => f.trim().toLowerCase());
    filterQuery.features = { $in: featureList };
  }

  // Multi-select color names
  if (req.query.colors) {
    const colorList = req.query.colors.split(',').map((c) => new RegExp(`^${c.trim()}$`, 'i'));
    filterQuery['colors.name'] = { $in: colorList };
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filterQuery.basePrice = {};
    if (req.query.minPrice) filterQuery.basePrice.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filterQuery.basePrice.$lte = parseFloat(req.query.maxPrice);
  }

  const features = new APIFeatures(Product.find(filterQuery), req.query)
    .search(['title', 'description', 'fabricType'])
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query
    .populate('category', 'name slug')
    .populate('subCategory', 'name slug')
    .populate('customizerRule', 'name constraints fullnessOptions liningOptions pleatHeaders hardwareAddons');

  const total = await Product.countDocuments(filterQuery);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    pagination: features.pagination,
    data: {
      products
    }
  });
});

/**
 * Public: Get single product by slug
 */
export const getProductBySlug = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true
  })
    .populate('category', 'name slug')
    .populate('subCategory', 'name slug')
    .populate('customizerRule');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Public: Get curated featured products
 */
export const getFeaturedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    isFeatured: true,
    isActive: true
  })
    .limit(8)
    .populate('category', 'name slug');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

/**
 * Public: Cross-sell "Complete the Look" / Related Products
 */
export const getRelatedProducts = catchAsync(async (req, res, next) => {
  const currentProduct = await Product.findById(req.params.id);
  if (!currentProduct) {
    return next(new AppError('Product not found', 404));
  }

  const related = await Product.find({
    _id: { $ne: currentProduct._id },
    isActive: true,
    $or: [
      { category: currentProduct.category },
      { fabricType: currentProduct.fabricType }
    ]
  })
    .limit(4)
    .select('title slug basePrice pricePerYard fabricType colors images category')
    .populate('category', 'name slug');

  res.status(200).json({
    status: 'success',
    results: related.length,
    data: {
      related
    }
  });
});

/**
 * Admin: Get all products
 */
export const adminGetAllProducts = catchAsync(async (req, res, next) => {
  const showDeleted = req.query.showDeleted === 'true';
  const query = Product.find({ includeDeleted: showDeleted });

  const features = new APIFeatures(query, req.query)
    .search(['title', 'sku', 'fabricType'])
    .filter()
    .sort()
    .paginate();

  const products = await features.query
    .populate('category', 'name slug')
    .populate('subCategory', 'name slug');

  const total = await Product.countDocuments({ includeDeleted: showDeleted });

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    data: {
      products
    }
  });
});

/**
 * Admin: Get single product by ID
 */
export const adminGetProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id, null, { includeDeleted: true })
    .populate('category')
    .populate('subCategory')
    .populate('customizerRule');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Admin: Create new product
 */
export const adminCreateProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

/**
 * Admin: Update product
 */
export const adminUpdateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * Admin: Soft delete product
 */
export const adminDeleteProduct = catchAsync(async (req, res, next) => {
  const product = req.productToDelete;

  product.isDeleted = true;
  product.deletedAt = Date.now();
  await product.save();

  res.status(200).json({
    status: 'success',
    message: `Product "${product.title}" has been soft-deleted.`
  });
});

/**
 * Admin: Restore soft-deleted product
 */
export const adminRestoreProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false, deletedAt: null },
    { new: true, includeDeleted: true }
  );

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

export default {
  getAllProducts,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  adminGetAllProducts,
  adminGetProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminRestoreProduct
};
