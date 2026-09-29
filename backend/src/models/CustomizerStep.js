import mongoose from 'mongoose';

/**
 * CustomizerStep Schema - Granular Made-to-Measure Step Specification
 * Represents steps such as "01 Choose style", "02 Select fabric", "03 Measurements", etc.
 */
const customizerStepSchema = new mongoose.Schema(
  {
    flowRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomizerFlow',
      required: [true, 'Parent configurator flow reference is required'],
      index: true
    },
    internalName: {
      type: String,
      required: [true, 'Internal step name is required'],
      trim: true
    },
    stepNumber: {
      type: String,
      required: [true, 'Display step number is required (e.g. 01, 02, 03)'],
      trim: true
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 1,
      index: true
    },
    heading: {
      type: String,
      required: [true, 'Customer-facing heading is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    stepType: {
      type: String,
      enum: [
        'style',
        'fabric',
        'dimensions',
        'mount',
        'lining',
        'control',
        'hardware',
        'finishing',
        'review',
        'custom'
      ],
      default: 'custom'
    },
    isEnabled: {
      type: Boolean,
      default: true,
      index: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for associated OptionLayers
customizerStepSchema.virtual('layers', {
  ref: 'OptionLayer',
  localField: '_id',
  foreignField: 'stepRef'
});

// Compound index for ordered steps inside flow
customizerStepSchema.index({ flowRef: 1, displayOrder: 1 });

// Soft-delete query filter
customizerStepSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeArchived) {
    this.find({ isArchived: { $ne: true } });
  }
  next();
});

const CustomizerStep = mongoose.model('CustomizerStep', customizerStepSchema);

export default CustomizerStep;
