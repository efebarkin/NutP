import mongoose from 'mongoose';

const userStatusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away', 'busy', 'invisible'],
    default: 'offline'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  device: {
    type: String,
    enum: ['web', 'mobile', 'desktop'],
    default: 'web'
  },
  customStatus: {
    type: String,
    maxlength: 100,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
userStatusSchema.index({ user: 1 });
userStatusSchema.index({ status: 1 });

const UserStatus = mongoose.model('UserStatus', userStatusSchema);

export default UserStatus;
