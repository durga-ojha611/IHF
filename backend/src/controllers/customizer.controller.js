import CustomizerRule from '../models/CustomizerRule.js';
import FabricOption from '../models/FabricOption.js';
import FilterOption from '../models/FilterOption.js';
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
 * Public: Get customizer fabrics grouped by material and filtered
 */
export const getCustomizerFabrics = catchAsync(async (req, res, next) => {
  const { collection, color, priceGroup, material, sort, search } = req.query;

  let query = { isActive: true };

  if (collection && collection.toUpperCase() !== 'ALL') {
    if (collection.toUpperCase() === 'MOST POPULAR') {
      query.isPopular = true;
    } else {
      query.collectionType = collection.toUpperCase();
    }
  }

  if (priceGroup && priceGroup.toUpperCase() !== 'ALL') {
    const pg = priceGroup.replace(/price\s*group\s*/i, '').trim().toUpperCase();
    query.priceGroup = pg;
  }

  if (material && material.toUpperCase() !== 'ALL') {
    query.materialGroup = new RegExp(material, 'i');
  }

  let fabrics = await FabricOption.find(query);

  // If filtered by color in memory/post-query
  if (color && color.toUpperCase() !== 'ALL') {
    const colLower = color.toLowerCase();
    fabrics = fabrics.filter(
      (f) =>
        f.color?.name?.toLowerCase().includes(colLower) ||
        f.name?.toLowerCase().includes(colLower)
    );
  }

  if (search) {
    const s = search.toLowerCase();
    fabrics = fabrics.filter(
      (f) =>
        f.name?.toLowerCase().includes(s) ||
        f.materialGroup?.toLowerCase().includes(s) ||
        f.collectionType?.toLowerCase().includes(s)
    );
  }

  // Sorting
  if (sort === 'price-asc') {
    fabrics.sort((a, b) => (a.fromPrice || 0) - (b.fromPrice || 0));
  } else if (sort === 'price-desc') {
    fabrics.sort((a, b) => (b.fromPrice || 0) - (a.fromPrice || 0));
  } else if (sort === 'name-asc') {
    fabrics.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else {
    fabrics.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  // Group by material group for presentation matching the UI
  const groupsMap = new Map();
  fabrics.forEach((fabric) => {
    const key = fabric.materialGroup || 'LINENS & NATURAL WEAVES';
    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        groupName: key,
        priceGroup: fabric.priceGroup || 'A',
        fromPrice: fabric.fromPrice || 650,
        description: fabric.materialDescription || 'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.',
        fabrics: []
      });
    }
    groupsMap.get(key).fabrics.push(fabric);
  });

  const materialGroups = Array.from(groupsMap.values());

  res.status(200).json({
    status: 'success',
    results: fabrics.length,
    data: {
      materialGroups,
      fabrics
    }
  });
});

/**
 * Public: Get customizer filter options (Collections, Colors, Prices, Materials, Sort)
 */
export const getCustomizerFilters = catchAsync(async (req, res, next) => {
  const collections = [
    'LINENS',
    'SHEERS',
    'WOOLS + BLENDS',
    'COTTONS',
    'SILKS',
    'SOLIDS',
    'PATTERNS',
    'KIDS',
    'DESIGNERS',
    'SUNBRELLA',
    'MOST POPULAR'
  ];

  const colors = [
    { label: 'White', value: 'White', hexCode: '#F5F5F0' },
    { label: 'Oatmeal', value: 'Oatmeal', hexCode: '#E6D7B9' },
    { label: 'Clay', value: 'Clay', hexCode: '#D2B48C' },
    { label: 'Slate', value: 'Slate', hexCode: '#708090' },
    { label: 'Sand', value: 'Sand', hexCode: '#C2B280' },
    { label: 'Sky', value: 'Sky', hexCode: '#87CEEB' },
    { label: 'Terracotta', value: 'Terracotta', hexCode: '#E2725B' },
    { label: 'Sage', value: 'Sage', hexCode: '#9DC183' },
    { label: 'Forest', value: 'Forest', hexCode: '#228B22' },
    { label: 'Charcoal', value: 'Charcoal', hexCode: '#36454F' }
  ];

  const prices = [
    { label: 'Price Group A', value: 'A', from: 650 },
    { label: 'Price Group B', value: 'B', from: 720 },
    { label: 'Price Group C', value: 'C', from: 850 }
  ];

  const materials = [
    { label: 'Linens & Natural Weaves', value: 'LINENS & NATURAL WEAVES' },
    { label: 'Cotton & Blends', value: 'COTTON & BLENDS' },
    { label: 'Wool & Blends', value: 'WOOL & BLENDS' },
    { label: 'Luxury Velvet', value: 'LUXURY VELVET' },
    { label: 'Architectural Sheers', value: 'ARCHITECTURAL SHEERS' },
    { label: 'Performance Sunbrella', value: 'PERFORMANCE SUNBRELLA' }
  ];

  const sortOptions = [
    { label: 'Featured / Popular', value: 'popular' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Alphabetical: A to Z', value: 'name-asc' }
  ];

  res.status(200).json({
    status: 'success',
    data: {
      collections,
      filters: {
        collection: collections.map((c) => ({ label: c, value: c })),
        color: colors,
        price: prices,
        material: materials,
        sort: sortOptions
      }
    }
  });
});

/**
 * Admin: Create Fabric Option
 */
export const adminCreateFabricOption = catchAsync(async (req, res, next) => {
  const fabric = await FabricOption.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      fabric
    }
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
  getCustomizerFabrics,
  getCustomizerFilters,
  adminCreateFabricOption,
  adminGetAllRules,
  adminGetRuleById,
  adminCreateRule,
  adminUpdateRule,
  adminDeleteRule
};

