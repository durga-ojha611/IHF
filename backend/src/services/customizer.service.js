import CustomizerRule from '../models/CustomizerRule.js';
import Product from '../models/Product.js';
import { parseInches } from '../utils/dimensionParser.js';
import AppError from '../utils/appError.js';

/**
 * Server-Side Precision Custom Curtain Price Engine
 * Re-validates dimensions and calculates exact pricing breakdown.
 */
export async function calculateCustomCurtainPrice({
  productId,
  width,
  height,
  fullnessId = 'standard',
  liningId = 'privacy',
  pleatId = 'pinch-pleat',
  hardwareIds = [],
  panelConfiguration = 'pair',
  quantity = 1,
  ruleKey = 'standard-drapery-rules'
}) {
  // 1. Fetch product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found for custom price calculation', 404);
  }

  // 2. Fetch active customizer rules
  let rule = null;
  if (product.customizerRule) {
    rule = await CustomizerRule.findById(product.customizerRule);
  }
  if (!rule) {
    rule = await CustomizerRule.findOne({ key: ruleKey, isActive: true });
  }
  if (!rule) {
    rule = await CustomizerRule.findOne({ isActive: true });
  }

  if (!rule) {
    throw new AppError('Customizer pricing rules are not configured in the system', 500);
  }

  // 3. Parse and validate fractional dimensions
  let parsedWidth;
  let parsedHeight;

  try {
    parsedWidth = parseInches(width);
  } catch (err) {
    throw new AppError(`Width measurement error: ${err.message}`, 400);
  }

  try {
    parsedHeight = parseInches(height);
  } catch (err) {
    throw new AppError(`Height measurement error: ${err.message}`, 400);
  }

  // 4. Validate dimension constraints
  const { minWidthInches, maxWidthInches, minHeightInches, maxHeightInches } = rule.constraints;

  if (parsedWidth.decimal < minWidthInches || parsedWidth.decimal > maxWidthInches) {
    throw new AppError(
      `Custom width must be between ${minWidthInches}" and ${maxWidthInches}". You provided ${parsedWidth.formatted}.`,
      400
    );
  }

  if (parsedHeight.decimal < minHeightInches || parsedHeight.decimal > maxHeightInches) {
    throw new AppError(
      `Custom height must be between ${minHeightInches}" and ${maxHeightInches}". You provided ${parsedHeight.formatted}.`,
      400
    );
  }

  // 5. Fullness Factor
  const fullnessOpt =
    rule.fullnessOptions.find((f) => f.id === fullnessId) ||
    rule.fullnessOptions.find((f) => f.isDefault) ||
    { id: 'standard', label: '2.0x Standard Fullness', factor: 2.0 };

  const fullnessFactor = fullnessOpt.factor;

  // 6. Lining Option
  const liningOpt =
    rule.liningOptions.find((l) => l.id === liningId) ||
    rule.liningOptions.find((l) => l.isDefault) ||
    { id: 'privacy', name: 'Standard Privacy Lining', type: 'privacy', pricePerYardMultiplier: 18, flatPriceAddon: 0 };

  // 7. Pleat Header Style
  const pleatOpt =
    rule.pleatHeaders.find((p) => p.id === pleatId) ||
    rule.pleatHeaders.find((p) => p.isDefault) ||
    { id: 'pinch-pleat', name: 'Three-Finger French Pinch Pleat', pricePerPanel: 45 };

  // 8. Hardware Add-ons
  const hardwareList = [];
  let hardwareTotal = 0;

  if (Array.isArray(hardwareIds) && hardwareIds.length > 0) {
    hardwareIds.forEach((hId) => {
      const hOption = rule.hardwareAddons.find((h) => h.id === hId);
      if (hOption) {
        hardwareList.push({
          id: hOption.id,
          name: hOption.name,
          price: hOption.price
        });
        hardwareTotal += hOption.price;
      }
    });
  }

  // 9. Standard Textile Formula:
  const panelMultiplier = panelConfiguration === 'single_panel' ? 1 : 2;

  const rollWidth = rule.fabricRollWidthInches || 54;
  const hemAllowance = rule.hemAllowanceInches || 16;

  const totalFabricWidthNeeded = parsedWidth.decimal * fullnessFactor;
  const cutsRequired = Math.max(panelMultiplier, Math.ceil(totalFabricWidthNeeded / rollWidth));
  const cutLengthInches = parsedHeight.decimal + hemAllowance;
  const totalFabricInches = cutsRequired * cutLengthInches;
  const exactYards = totalFabricInches / 36;
  const fabricYardage = Math.max(3, Math.ceil(exactYards * 2) / 2);

  const pricePerYard = product.pricePerYard || 65;
  const fabricCost = Math.round(fabricYardage * pricePerYard * 100) / 100;

  let liningCost = 0;
  if (liningOpt.type !== 'unlined') {
    const liningYardRate = liningOpt.pricePerYardMultiplier || 18;
    liningCost = Math.round((fabricYardage * liningYardRate + (liningOpt.flatPriceAddon || 0)) * 100) / 100;
  }

  const pleatLaborCost = (pleatOpt.pricePerPanel || 0) * panelMultiplier;
  const baseLaborCost = (rule.laborBaseFee || 95) * panelMultiplier;

  const calculatedUnitPrice = Math.round(
    (fabricCost + liningCost + pleatLaborCost + hardwareTotal + baseLaborCost) * 100
  ) / 100;

  const validQty = Math.max(1, parseInt(quantity, 10) || 1);
  const totalPrice = Math.round(calculatedUnitPrice * validQty * 100) / 100;

  return {
    product: {
      id: product._id,
      title: product.title,
      fabricType: product.fabricType,
      pricePerYard: product.pricePerYard,
      image: product.images?.[0]?.url || ''
    },
    specs: {
      width: parsedWidth,
      height: parsedHeight,
      fullness: {
        id: fullnessOpt.id,
        label: fullnessOpt.label,
        factor: fullnessOpt.factor
      },
      lining: {
        id: liningOpt.id,
        name: liningOpt.name,
        type: liningOpt.type
      },
      pleatHeader: {
        id: pleatOpt.id,
        name: pleatOpt.name
      },
      hardware: hardwareList,
      panelConfiguration,
      quantity: validQty
    },
    priceBreakdown: {
      fabricYardage,
      fabricCost,
      liningCost,
      pleatLaborCost,
      hardwareCost: hardwareTotal,
      baseLaborCost,
      calculatedUnitPrice,
      totalPrice
    }
  };
}

export default {
  calculateCustomCurtainPrice
};
