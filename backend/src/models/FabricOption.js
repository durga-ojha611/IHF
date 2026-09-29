import mongoose from 'mongoose';

const fabricOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Fabric name is required (e.g. Oatmeal Linen)'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    collectionType: {
      type: String,
      required: [true, 'Collection is required'],
      enum: [
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
      ],
      trim: true,
      index: true
    },
    materialGroup: {
      type: String,
      required: [true, 'Material group is required (e.g. LINENS & NATURAL WEAVES)'],
      trim: true,
      index: true
    },
    materialDescription: {
      type: String,
      default:
        'Soft, breathable and wonderfully versatile, long-staple fibres bring understated everyday elegance to both classic architectural spaces and contemporary interiors.'
    },
    priceGroup: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D'],
      default: 'A',
      index: true
    },
    fromPrice: {
      type: Number,
      default: 650
    },
    color: {
      name: { type: String, required: true },
      hexCode: { type: String, default: '#E6D7B9' }
    },
    image: {
      type: String,
      required: true
    },
    closeupImage: {
      type: String,
      default: ''
    },
    specs: {
      composition: { type: String, default: '100% Belgian Flax Linen' },
      weight: { type: String, default: '320 GSM (Heavyweight Architectural Drape)' },
      durability: { type: String, default: '30,000 Martindale Rubs (Commercial Grade)' },
      lightFiltering: { type: String, default: 'Semi-Sheer to Light Filtering (Soft Glow)' },
      care: { type: String, default: 'Professional dry clean or steam in situ.' }
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true
    },
    displayOrder: {
      type: Number,
      default: 0
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

fabricOptionSchema.index({ collectionType: 1, materialGroup: 1, priceGroup: 1 });

fabricOptionSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const FabricOption = mongoose.model('FabricOption', fabricOptionSchema);

export default FabricOption;
