import mongoose from 'mongoose';

const swatchOrderSchema = new mongoose.Schema(
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
      phone: { type: String, default: '' },
      shippingAddress: {
        street: { type: String, required: true },
        apartment: { type: String, default: '' },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'US' }
      }
    },
    swatches: [
      {
        swatch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Swatch',
          required: true
        },
        fabricName: String,
        colorName: String,
        hexCode: String,
        image: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },
    carrier: {
      type: String,
      default: 'USPS'
    },
    trackingNumber: {
      type: String,
      default: ''
    },
    fulfillmentNotes: {
      type: String,
      default: ''
    },
    totalCost: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate swatch order number
swatchOrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `SW-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  }
  next();
});

swatchOrderSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const SwatchOrder = mongoose.model('SwatchOrder', swatchOrderSchema);

export default SwatchOrder;
