import mongoose from 'mongoose';

/**
 * OptionItem Sub-Schema - Individual selectable option within a layer
 */
const optionItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Option identifier is required'],
      trim: true
    },
    label: {
      type: String,
      required: [true, 'Option label is required'],
      trim: true
    },
    value: {
      type: String,
      required: [true, 'Option value is required'],
      trim: true
    },
    priceType: {
      type: String,
      enum: ['flat', 'per_yard', 'multiplier', 'free'],
      default: 'free'
    },
    priceAddon: {
      type: Number,
      default: 0,
      min: 0
    },
    image: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { _id: true }
);

/**
 * OptionLayer Schema - Configurable Option Groupings within a Customizer Step
 * Represents sections such as "Primary selection", "Conditional additions", "Help & measurement guidance"
 */
const optionLayerSchema = new mongoose.Schema(
  {
    stepRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomizerStep',
      required: [true, 'Step reference is required'],
      index: true
    },
    flowRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomizerFlow',
      required: [true, 'Flow reference is required'],
      index: true
    },
    layerName: {
      type: String,
      required: [true, 'Layer name is required (e.g. Primary selection)'],
      trim: true
    },
    layerType: {
      type: String,
      enum: ['selection', 'dimensions', 'swatch_picker', 'toggle', 'guidance'],
      default: 'selection'
    },
    displayOrder: {
      type: Number,
      default: 1
    },
    visibilityCondition: {
      type: {
        type: String,
        enum: ['always', 'conditional'],
        default: 'always'
      },
      ruleExpression: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      description: {
        type: String,
        default: 'Always visible'
      }
    },
    layerConfigTrigger: {
      type: String,
      default: ''
    },
    optionsArray: [optionItemSchema],
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

// Soft-delete query filter
optionLayerSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeArchived) {
    this.find({ isArchived: { $ne: true } });
  }
  next();
});

const OptionLayer = mongoose.model('OptionLayer', optionLayerSchema);

export default OptionLayer;
