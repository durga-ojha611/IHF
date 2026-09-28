import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import FilterOption from '../models/FilterOption.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Cascading Safety Check: Prevent deleting a category if active products or pending orders rely on it.
 */
export const checkCategoryCanBeDeleted = catchAsync(async (req, res, next) => {
  const categoryId = req.params.id;

  // 1. Check if category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // 2. Check if subcategories exist
  const subcategoryCount = await Category.countDocuments({
    parentCategory: categoryId,
    isDeleted: false
  });
  if (subcategoryCount > 0) {
    return next(
      new AppError(
        `Cannot delete category "${category.name}". It has ${subcategoryCount} active sub-categories linked to it. Delete or reassign sub-categories first.`,
        400
      )
    );
  }

  // 3. Check for active products linked to this category
  const linkedProducts = await Product.find({
    $or: [{ category: categoryId }, { subCategory: categoryId }],
    isDeleted: false
  }).select('_id title');

  if (linkedProducts.length > 0) {
    return next(
      new AppError(
        `Cannot delete category "${category.name}". There are ${linkedProducts.length} active product(s) assigned to it (e.g. "${linkedProducts[0].title}"). Reassign or remove these products first.`,
        400
      )
    );
  }

  // 4. Check for active/pending customer orders referencing products formerly under this category
  const productIds = linkedProducts.map((p) => p._id);
  if (productIds.length > 0) {
    const activeOrders = await Order.countDocuments({
      'items.product': { $in: productIds },
      fulfillmentStatus: { $in: ['Pending', 'Manufacturing'] }
    });

    if (activeOrders > 0) {
      return next(
        new AppError(
          `Cannot delete category. There are ${activeOrders} active customer orders in progress that depend on products in this category.`,
          400
        )
      );
    }
  }

  req.categoryToDelete = category;
  next();
});

/**
 * Cascading Safety Check: Prevent deleting a product if it is in an active/pending customer order.
 */
export const checkProductCanBeDeleted = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if any order is currently in Pending or Manufacturing state containing this product
  const activeOrders = await Order.find({
    'items.product': productId,
    fulfillmentStatus: { $in: ['Pending', 'Manufacturing'] }
  })
    .select('orderNumber fulfillmentStatus')
    .limit(3);

  if (activeOrders.length > 0) {
    const orderNumbers = activeOrders.map((o) => o.orderNumber).join(', ');
    return next(
      new AppError(
        `Cannot delete product "${product.title}". It is tied to active manufacturing/pending orders (${orderNumbers}). Fulfillment must be completed or cancelled first.`,
        400
      )
    );
  }

  req.productToDelete = product;
  next();
});

/**
 * Cascading Safety Check: Prevent deleting a filter attribute if active products depend on it.
 */
export const checkFilterCanBeDeleted = catchAsync(async (req, res, next) => {
  const filterId = req.params.id;

  const filter = await FilterOption.findById(filterId);
  if (!filter) {
    return next(new AppError('Filter option not found', 404));
  }

  let query = { isDeleted: false };
  if (filter.group === 'fabric') {
    query.fabricType = new RegExp(`^${filter.value}$`, 'i');
  } else if (filter.group === 'style') {
    query.styles = filter.value;
  } else if (filter.group === 'feature') {
    query.features = filter.value;
  } else if (filter.group === 'color') {
    query['colors.name'] = new RegExp(`^${filter.label}$`, 'i');
  }

  const linkedProductCount = await Product.countDocuments(query);
  if (linkedProductCount > 0) {
    return next(
      new AppError(
        `Cannot delete filter attribute "${filter.label}". There are ${linkedProductCount} active product(s) tagged with this attribute.`,
        400
      )
    );
  }

  req.filterToDelete = filter;
  next();
});

export default {
  checkCategoryCanBeDeleted,
  checkProductCanBeDeleted,
  checkFilterCanBeDeleted
};
