import FilterOption from '../models/FilterOption.js';
import Product from '../models/Product.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Public: Get sidebar filters with REAL-TIME DYNAMIC PRODUCT COUNTS
 */
export const getDynamicFilters = catchAsync(async (req, res, next) => {
  const filterOptions = await FilterOption.find({ isActive: true }).sort('displayOrder');

  const [fabricCounts, styleCounts, featureCounts, colorCounts] = await Promise.all([
    Product.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      { $group: { _id: { $toLower: '$fabricType' }, count: { $sum: 1 } } }
    ]),
    Product.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      { $unwind: '$styles' },
      { $group: { _id: { $toLower: '$styles' }, count: { $sum: 1 } } }
    ]),
    Product.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      { $unwind: '$features' },
      { $group: { _id: { $toLower: '$features' }, count: { $sum: 1 } } }
    ]),
    Product.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      { $unwind: '$colors' },
      { $group: { _id: { $toLower: '$colors.name' }, count: { $sum: 1 } } }
    ])
  ]);

  const mapCounts = (arr) => {
    const map = {};
    arr.forEach((item) => {
      if (item._id) map[item._id] = item.count;
    });
    return map;
  };

  const fabricMap = mapCounts(fabricCounts);
  const styleMap = mapCounts(styleCounts);
  const featureMap = mapCounts(featureCounts);
  const colorMap = mapCounts(colorCounts);

  const groupedFilters = {
    fabric: [],
    color: [],
    style: [],
    feature: [],
    size: []
  };

  filterOptions.forEach((filter) => {
    let count = 0;
    const valKey = (filter.value || '').toLowerCase();
    const labelKey = (filter.label || '').toLowerCase();

    if (filter.group === 'fabric') {
      count = fabricMap[valKey] || fabricMap[labelKey] || 0;
    } else if (filter.group === 'style') {
      count = styleMap[valKey] || styleMap[labelKey] || 0;
    } else if (filter.group === 'feature') {
      count = featureMap[valKey] || featureMap[labelKey] || 0;
    } else if (filter.group === 'color') {
      count = colorMap[labelKey] || colorMap[valKey] || 0;
    }

    if (groupedFilters[filter.group]) {
      groupedFilters[filter.group].push({
        id: filter._id,
        label: filter.label,
        value: filter.value,
        hexCode: filter.hexCode,
        displayOrder: filter.displayOrder,
        count
      });
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      filters: groupedFilters
    }
  });
});

/**
 * Admin: Get all filters
 */
export const adminGetAllFilters = catchAsync(async (req, res, next) => {
  const filters = await FilterOption.find().sort('group displayOrder');

  res.status(200).json({
    status: 'success',
    results: filters.length,
    data: {
      filters
    }
  });
});

/**
 * Admin: Create filter option
 */
export const adminCreateFilter = catchAsync(async (req, res, next) => {
  const filter = await FilterOption.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      filter
    }
  });
});

/**
 * Admin: Update filter option
 */
export const adminUpdateFilter = catchAsync(async (req, res, next) => {
  const filter = await FilterOption.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!filter) {
    return next(new AppError('Filter option not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      filter
    }
  });
});

/**
 * Admin: Delete filter option
 */
export const adminDeleteFilter = catchAsync(async (req, res, next) => {
  const filter = req.filterToDelete;
  await filter.deleteOne();

  res.status(200).json({
    status: 'success',
    message: `Filter option "${filter.label}" deleted successfully.`
  });
});

export default {
  getDynamicFilters,
  adminGetAllFilters,
  adminCreateFilter,
  adminUpdateFilter,
  adminDeleteFilter
};
