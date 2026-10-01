import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    consultationNumber: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true
    },
    room: {
      type: String,
      default: 'Living Room',
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Consultation date is required']
    },
    time: {
      type: String,
      required: [true, 'Consultation time window is required'],
      default: '11:00 AM'
    },
    type: {
      type: String,
      enum: ['phone'],
      default: 'phone'
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
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
    },
    internalNotes: {
      type: String,
      default: ''
    },
    assignedDesigner: {
      type: String,
      default: 'Atelier Senior Consultant'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
consultationSchema.index({ createdAt: -1 });
consultationSchema.index({ status: 1, isArchived: 1 });
consultationSchema.index({ email: 1 });

// Generate friendly consultation reference number before save
consultationSchema.pre('save', function (next) {
  if (!this.consultationNumber) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.consultationNumber = `IHF-CON-${randomSuffix}`;
  }
  next();
});

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
