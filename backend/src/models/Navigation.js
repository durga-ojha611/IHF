import mongoose from 'mongoose';

const navColumnItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    path: { type: String, required: true },
    badge: { type: String, default: '' },
    isExternal: { type: Boolean, default: false }
  },
  { _id: true }
);

const navColumnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    items: [navColumnItemSchema]
  },
  { _id: true }
);

const navigationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Navigation title is required'],
      trim: true
    },
    path: {
      type: String,
      default: '/'
    },
    type: {
      type: String,
      enum: ['link', 'dropdown', 'mega_menu'],
      default: 'link'
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Navigation',
      default: null,
      index: true
    },
    badge: {
      type: String,
      default: ''
    },
    columns: [navColumnSchema],
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

navigationSchema.virtual('children', {
  ref: 'Navigation',
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
  match: { isDeleted: false, isActive: true }
});

navigationSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

const Navigation = mongoose.model('Navigation', navigationSchema);

export default Navigation;
