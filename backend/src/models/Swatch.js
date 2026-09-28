import mongoose from 'mongoose';

const swatchSchema = new mongoose.Schema(
  {
    fabricName: {
      type: String,
      required: [true, 'Fabric name is required (e.g. Belgian Flax Linen)'],
      trim: true
    },
    colorName: {
      type: String,
      required: [true, 'Color name is required (e.g. Champagne White)'],
      trim: true
    },
    hexCode: {
      type: String,
      required: [true, 'Hex color code is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Invalid hex code format'
      }
    },
    material: {
      type: String,
      default: '100% Premium Fabric'
    },
    weightGsm: {
      type: Number,
      default: 380
    },
    texture: {
      type: String,
      default: 'Textured Weave'
    },
    image: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' }
    },
    inStock: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number,
      default: 0
    },
    tags: [String],
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

swatchSchema.index({ fabricName: 1, colorName: 1 });

swatchSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Swatch = mongoose.model('Swatch', swatchSchema);

export default Swatch;
