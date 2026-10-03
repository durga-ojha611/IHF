import mongoose from 'mongoose';
import slugify from 'slugify';

const productColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hexCode: { type: String, required: true },
    image: { type: String, default: '' },
    inStock: { type: Boolean, default: true }
  },
  { _id: true }
);

const productImageSchema = new mongoose.Schema(
  {
    externalId: { type: String, default: '' },
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    variantIds: [{ type: String }]
  },
  { _id: true }
);

const productVariantSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true },
    title: { type: String, default: '' },
    sku: { type: String, default: '' },
    options: [{ name: String, value: String }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    available: { type: Boolean, default: true },
    requiresShipping: { type: Boolean, default: true },
    taxable: { type: Boolean, default: true },
    grams: { type: Number, default: 0 },
    position: { type: Number, default: 0 },
    featuredImage: { type: String, default: '' },
    sourceCreatedAt: { type: Date, default: null },
    sourceUpdatedAt: { type: Date, default: null }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Product detailed description is required']
    },
    bodyHtml: { type: String, default: '' },
    vendor: { type: String, default: '' },
    productType: { type: String, default: '', index: true },
    tags: [{ type: String, trim: true }],
    sourceOptions: [{ name: String, position: Number, values: [String] }],
    variants: [productVariantSchema],
    source: {
      platform: { type: String, default: '' },
      externalId: { type: String, index: true },
      handle: { type: String, default: '' },
      url: { type: String, default: '' },
      publishedAt: { type: Date, default: null },
      createdAt: { type: Date, default: null },
      updatedAt: { type: Date, default: null },
      syncedAt: { type: Date, default: null }
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true
    },
    basePrice: {
      type: Number,
      required: [true, 'Starting base price is required'],
      min: [0, 'Base price cannot be negative']
    },
    compareAtPrice: { type: Number, default: null },
    currency: { type: String, default: 'USD' },
    pricePerYard: {
      type: Number,
      default: 45,
      min: [0, 'Price per yard cannot be negative']
    },
    fabricType: {
      type: String,
      required: [true, 'Fabric type is required (e.g. linen, velvet, cotton, sheer)'],
      trim: true,
      lowercase: true,
      index: true
    },
    colors: [productColorSchema],
    styles: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    features: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    standardSizes: [
      {
        type: String,
        trim: true
      }
    ],
    materialComposition: { type: String, default: '' }, weaveConstruction: { type: String, default: '' },
    finishingProcess: { type: String, default: '' }, origin: { type: String, default: '' }, weight: { type: String, default: '' },
    careInstructions: [{ type: String, trim: true }],
    benefits: [{ title: String, description: String, icon: String }],
    dimensions: [{ size: String, metric: String, imperial: String }],
    faqs: [{ question: String, answer: String }],
    bundleItems: [{ name: String, image: String, price: Number, variant: String, selected: { type: Boolean, default: false } }],
    reviews: [{ title: String, body: String, author: String, rating: { type: Number, default: 5 }, date: String }],
    ratingAverage: { type: Number, default: 0 }, ratingCount: { type: Number, default: 0 },
    editorial: { eyebrow: String, title: String, description: String, image: String },
    images: [productImageSchema],
    stockStatus: {
      type: String,
      enum: ['in_stock', 'pre_order', 'out_of_stock'],
      default: 'in_stock'
    },
    inventoryCount: {
      type: Number,
      default: 999
    },
    isCustomizable: {
      type: Boolean,
      default: true,
      index: true
    },
    customizerRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomizerRule',
      default: null
    },
    isFeatured: {
      type: Boolean,
      default: false,
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
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for dynamic filtering and catalog navigation
productSchema.index({ category: 1, isDeleted: 1, isActive: 1 });
productSchema.index({ fabricType: 1, basePrice: 1, isDeleted: 1 });
productSchema.index({ styles: 1, isDeleted: 1 });
productSchema.index({ features: 1, isDeleted: 1 });
productSchema.index({ title: 'text', description: 'text', fabricType: 'text' });
productSchema.index({ 'source.platform': 1, 'source.externalId': 1 }, { unique: true, sparse: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

// Auto exclude soft-deleted products
productSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
