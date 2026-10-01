import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userEmail: {
      type: String,
      required: true,
      index: true
    },
    userRole: {
      type: String,
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE_RESOURCE',
        'UPDATE_RESOURCE',
        'DELETE_RESOURCE',
        'PRICE_UPDATE',
        'ROLE_CHANGE',
        'ORDER_STATUS_UPDATE',
        'PASSWORD_RESET',
        'LOGIN_FAILURE',
        'SECURITY_ALERT'
      ],
      index: true
    },
    resource: {
      type: String,
      required: true,
      index: true
    },
    resourceId: {
      type: String,
      default: null,
      index: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-expire raw logs after 365 days for GDPR / compliance data minimization
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
