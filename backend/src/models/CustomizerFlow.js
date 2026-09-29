import mongoose from 'mongoose';

/**
 * CustomizerFlow Schema - Luxury Made-to-Measure Configurator Flow
 * Represents top-level configurator pipelines (e.g. "Drapery configurator", "Roman Shades Flow")
 */
const customizerFlowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Flow title is required'],
      trim: true,
      maxlength: [100, 'Flow title cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: [true, 'Flow slug identifier is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true
    },
    version: {
      type: Number,
      default: 1,
      min: 1
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    totalSteps: {
      type: Number,
      default: 0
    },
    totalOptions: {
      type: Number,
      default: 0
    },
    totalRules: {
      type: Number,
      default: 0
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isArchived: {
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

// Virtual for formatted status badge matching UI (e.g. "Published v8")
customizerFlowSchema.virtual('statusBadge').get(function () {
  if (this.status === 'published') {
    return `Published v${this.version}`;
  }
  return this.status.charAt(0).toUpperCase() + this.status.slice(1);
});

// Soft-delete query middleware: exclude archived records automatically unless explicitly requested
customizerFlowSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeArchived) {
    this.find({ isArchived: { $ne: true } });
  }
  next();
});

const CustomizerFlow = mongoose.model('CustomizerFlow', customizerFlowSchema);

export default CustomizerFlow;
