import { getStripe } from '../config/stripe.js';
import Product from '../models/Product.js';
import Swatch from '../models/Swatch.js';
import { calculateCustomCurtainPrice } from './customizer.service.js';
import AppError from '../utils/appError.js';

/**
 * Re-validates all incoming items strictly on the server and calculates reliable totals.
 */
export async function validateAndCalculateOrderTotals(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new AppError('Cart must contain at least one item', 400);
  }

  const verifiedItems = [];
  let subtotal = 0;

  for (const item of rawItems) {
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

    if (item.itemType === 'custom_curtain') {
      const calculation = await calculateCustomCurtainPrice({
        productId: item.productId || item.product,
        width: item.width,
        height: item.height,
        fullnessId: item.fullnessId,
        liningId: item.liningId,
        pleatId: item.pleatId,
        hardwareIds: item.hardwareIds,
        panelConfiguration: item.panelConfiguration || 'pair',
        quantity: qty
      });

      const unitPrice = calculation.priceBreakdown.calculatedUnitPrice;
      const lineTotal = Math.round(unitPrice * qty * 100) / 100;

      subtotal += lineTotal;

      verifiedItems.push({
        itemType: 'custom_curtain',
        product: calculation.product.id,
        title: item.title || `${calculation.product.title} (Custom Drapes)`,
        image: calculation.product.image || item.image || '',
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal,
        customCurtainSpecs: {
          width: calculation.specs.width,
          height: calculation.specs.height,
          fullness: calculation.specs.fullness,
          lining: calculation.specs.lining,
          pleatHeader: calculation.specs.pleatHeader,
          hardware: calculation.specs.hardware,
          color: {
            name: item.colorName || 'Default Color',
            hexCode: item.hexCode || ''
          },
          fabricType: calculation.product.fabricType,
          panelConfiguration: calculation.specs.panelConfiguration,
          priceBreakdown: calculation.priceBreakdown
        }
      });
    } else if (item.itemType === 'swatch_kit') {
      const swatchIds = Array.isArray(item.swatchIds) ? item.swatchIds : [];
      const swatches = await Swatch.find({ _id: { $in: swatchIds }, isDeleted: false });

      let swatchCost = 0;
      const swatchDetails = swatches.map((s) => {
        swatchCost += s.price || 0;
        return {
          swatchId: s._id,
          fabricName: s.fabricName,
          colorName: s.colorName,
          hexCode: s.hexCode
        };
      });

      const unitPrice = swatchCost > 0 ? swatchCost : (swatches.length > 5 ? 10 : 0);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      verifiedItems.push({
        itemType: 'swatch_kit',
        product: null,
        title: item.title || `Fabric Swatch Sample Kit (${swatches.length} Swatches)`,
        image: swatches[0]?.image?.url || '',
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal,
        swatchKitDetails: swatchDetails
      });
    } else {
      const product = await Product.findById(item.productId || item.product);
      if (!product || product.isDeleted) {
        throw new AppError(`Product not available: ${item.title || item.productId}`, 400);
      }

      const unitPrice = product.basePrice;
      const lineTotal = Math.round(unitPrice * qty * 100) / 100;
      subtotal += lineTotal;

      verifiedItems.push({
        itemType: 'standard_product',
        product: product._id,
        title: product.title,
        image: product.images?.[0]?.url || '',
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal
      });
    }
  }

  const shipping = subtotal >= 500 ? 0 : 35;
  const tax = Math.round(subtotal * 0.075 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return {
    verifiedItems,
    pricing: {
      subtotal,
      shipping,
      tax,
      discount: 0,
      total
    }
  };
}

/**
 * Creates a Stripe PaymentIntent with server-verified total (amounts in cents)
 */
export async function createStripePaymentIntent({ amountInCents, currency = 'usd', metadata = {} }) {
  const stripe = getStripe();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: {
        enabled: true
      },
      metadata
    });

    return paymentIntent;
  } catch (err) {
    if (
      process.env.NODE_ENV !== 'production' ||
      err.type === 'StripeAuthenticationError' ||
      err.statusCode === 401 ||
      err.message?.includes('Invalid API Key') ||
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.includes('mock') ||
      process.env.STRIPE_SECRET_KEY.includes('placeholder')
    ) {
      console.warn('[Stripe] Using Dev Mock PaymentIntent for test/placeholder environment');
      return {
        id: `pi_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        client_secret: `pi_mock_secret_${Date.now()}`,
        amount: amountInCents,
        currency,
        status: 'requires_payment_method',
        metadata
      };
    }
    throw err;
  }
}

export default {
  validateAndCalculateOrderTotals,
  createStripePaymentIntent
};
