import mongoose from 'mongoose';

const fullnessOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    factor: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const liningOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['unlined', 'privacy', 'blackout', 'thermal', 'interlining'],
      default: 'privacy'
    },
    pricePerYardMultiplier: { type: Number, default: 0 },
    flatPriceAddon: { type: Number, default: 0 },
    description: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const pleatHeaderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    pricePerPanel: { type: Number, default: 0 },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const hardwareAddonSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['track', 'rod', 'rings', 'motorization', 'tieback'],
      default: 'track'
    },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    isMotorized: { type: Boolean, default: false }
  },
  { _id: false }
);

const customizerRuleSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    constraints: {
      minWidthInches: { type: Number, default: 24 },
      maxWidthInches: { type: Number, default: 240 },
      minHeightInches: { type: Number, default: 36 },
      maxHeightInches: { type: Number, default: 200 },
      allowedFractions: {
        type: [String],
        default: ['', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8']
      }
    },
    fabricRollWidthInches: {
      type: Number,
      default: 54
    },
    hemAllowanceInches: {
      type: Number,
      default: 16
    },
    laborBaseFee: {
      type: Number,
      default: 95
    },
    fullnessOptions: [fullnessOptionSchema],
    liningOptions: [liningOptionSchema],
    pleatHeaders: [pleatHeaderSchema],
    hardwareAddons: [hardwareAddonSchema],
    flowRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomizerFlow',
      default: null,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
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

customizerRuleSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const CustomizerRule = mongoose.model('CustomizerRule', customizerRuleSchema);

export default CustomizerRule;
