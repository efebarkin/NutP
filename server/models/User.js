import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  favoriteFoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }],
  meals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],
  refreshToken: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  weeklyPlan: {
    type: Map,
    of: {
      breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
      lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
      dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
      snacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]
    },
    default: () => new Map([
      ['monday', { breakfast: null, lunch: null, dinner: null, snacks: [] }],
      ['tuesday', { breakfast: null, lunch: null, dinner: null, snacks: [] }],
      ['wednesday', { breakfast: null, lunch: null, dinner: null, snacks: [] }],
      ['thursday', { breakfast: null, lunch: null, dinner: null, snacks: [] }],
      ['friday', { breakfast: null, lunch: null, dinner: null, snacks: [] }],
      ['saturday', { breakfast: null, lunch: null, dinner: null, snacks: [] }],
      ['sunday', { breakfast: null, lunch: null, dinner: null, snacks: [] }]
    ])
  },
  bodyMetrics: {
    type: Map,
    of: {
      value: Number,
      date: { type: Date, default: Date.now }
    },
    default: () => new Map()
  },
  // Mesajlaşma ve arkadaşlık sistemi için eklenen alanlar
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Friendship'
  }],
  conversations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  socketId: {
    type: String,
    default: null
  },
  settings: {
    notifications: {
      messages: { type: Boolean, default: true },
      friendRequests: { type: Boolean, default: true }
    },
    privacy: {
      showOnlineStatus: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password verification method
userSchema.methods.verifyPassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
};

// Indexes
userSchema.index({ 'weeklyPlan.monday.breakfast': 1 });
userSchema.index({ 'weeklyPlan.monday.lunch': 1 });
userSchema.index({ 'weeklyPlan.monday.dinner': 1 });
userSchema.index({ 'weeklyPlan.tuesday.breakfast': 1 });
userSchema.index({ 'weeklyPlan.tuesday.lunch': 1 });
userSchema.index({ 'weeklyPlan.tuesday.dinner': 1 });
userSchema.index({ 'weeklyPlan.wednesday.breakfast': 1 });
userSchema.index({ 'weeklyPlan.wednesday.lunch': 1 });
userSchema.index({ 'weeklyPlan.wednesday.dinner': 1 });
userSchema.index({ 'weeklyPlan.thursday.breakfast': 1 });
userSchema.index({ 'weeklyPlan.thursday.lunch': 1 });
userSchema.index({ 'weeklyPlan.thursday.dinner': 1 });
userSchema.index({ 'weeklyPlan.friday.breakfast': 1 });
userSchema.index({ 'weeklyPlan.friday.lunch': 1 });
userSchema.index({ 'weeklyPlan.friday.dinner': 1 });
userSchema.index({ 'weeklyPlan.saturday.breakfast': 1 });
userSchema.index({ 'weeklyPlan.saturday.lunch': 1 });
userSchema.index({ 'weeklyPlan.saturday.dinner': 1 });
userSchema.index({ 'weeklyPlan.sunday.breakfast': 1 });
userSchema.index({ 'weeklyPlan.sunday.lunch': 1 });
userSchema.index({ 'weeklyPlan.sunday.dinner': 1 });

// Model zaten varsa kullan, yoksa oluştur
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
