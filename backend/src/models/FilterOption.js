import mongoose from 'mongoose';

const filterOptionSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: [true, 'Filter group is required'],
      enum: ['fabric', 'color', 'size', 'style', 'feature'],
      lowercase: true,
      index: true
    },
    label: {
      type: String,
      required: [true, 'Filter label is required'],
      trim: true
    },
    value: {
      type: String,
      required: [true, 'Filter value identifier is required'],
      trim: true,
      lowercase: true
    },
    hexCode: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Invalid hex color code format (e.g. #FFFFFF or #FFF)'
      }
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

filterOptionSchema.index({ group: 1, value: 1, isDeleted: 1 });

filterOptionSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const FilterOption = mongoose.model('FilterOption', filterOptionSchema);

export default FilterOption;
