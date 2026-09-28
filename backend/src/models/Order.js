import mongoose from 'mongoose';

const customCurtainSpecsSchema = new mongoose.Schema(
  {
    width: {
      raw: { type: String, required: true },
      decimal: { type: Number, required: true },
      formatted: { type: String, required: true }
    },
    height: {
      raw: { type: String, required: true },
      decimal: { type: Number, required: true },
      formatted: { type: String, required: true }
    },
    fullness: {
      id: { type: String, default: 'standard' },
      label: { type: String, default: '2.0x Standard Fullness' },
      factor: { type: Number, default: 2.0 }
    },
    lining: {
      id: { type: String, default: 'privacy' },
      name: { type: String, default: 'Standard Privacy Lining' },
      type: { type: String, default: 'privacy' }
    },
    pleatHeader: {
      id: { type: String, default: 'pinch-pleat' },
      name: { type: String, default: 'Three-Finger French Pinch Pleat' }
    },
    hardware: [
      {
        id: String,
        name: String,
        price: Number
      }
    ],
    color: {
      name: { type: String, required: true },
      hexCode: { type: String, default: '' }
    },
    fabricType: { type: String, required: true },
    panelConfiguration: {
      type: String,
      enum: ['single_panel', 'pair'],
      default: 'pair'
    },
    priceBreakdown: {
      fabricYardage: Number,
      fabricCost: Number,
      liningCost: Number,
      pleatLaborCost: Number,
      hardwareCost: Number,
      baseLaborCost: Number,
      calculatedUnitPrice: Number
    }
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ['custom_curtain', 'standard_product', 'swatch_kit'],
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative']
    },
    totalPrice: {
      type: Number,
      required: true
    },
    customCurtainSpecs: {
      type: customCurtainSpecsSchema,
      default: null
    },
    swatchKitDetails: [
      {
        swatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Swatch' },
        fabricName: String,
        colorName: String,
        hexCode: String
      }
    ]
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' }
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'US' },
      phone: { type: String, default: '' }
    },
    paymentInfo: {
      stripePaymentIntentId: { type: String, index: true },
      stripeClientSecret: String,
      paymentStatus: {
        type: String,
        enum: ['pending', 'authorized', 'paid', 'failed', 'refunded'],
        default: 'pending',
        index: true
      },
      paymentMethod: { type: String, default: 'card' },
      paidAt: Date
    },
    fulfillmentStatus: {
      type: String,
      enum: ['Pending', 'Manufacturing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true
    },
    carrier: {
      type: String,
      default: 'FedEx Custom Freight'
    },
    trackingNumber: {
      type: String,
      default: ''
    },
    manufacturingNotes: {
      type: String,
      default: ''
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate high-ticket luxury order identifier
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `IHF-${year}-${rand}`;
  }
  next();
});

orderSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
