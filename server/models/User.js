import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password should be at least 8 characters'],
    maxlength: [50, 'Password should be at most 50 characters'],
    select: false,
    validate: {
      validator: function (password) {
        // En az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermeli
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        return passwordRegex.test(password);
      },
      message:
        'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir',
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
    regex: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, // Sadece harf ve boşluk içerebilir
    validate: {
      validator: (name) => name.length >= 2 && name.length <= 50,
      message: 'Name must be between 2 and 50 characters',
    },
  },
  refreshToken: String, // Only store refresh token for revocation purposes
  favoriteFoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }],
  meals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],
  role: {
    type: [String],
    enum: ['user', 'admin', 'trainer', 'nutritionist'],
    default: ['user']
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
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    select: false
  },
  verificationCodeExpires: {
    type: Date,
    select: false
  },
  dailyWaterGoalML: {
    type: Number,
    default: 2500 // Default to 2500ml
  },
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
    this.passwordConfirm = undefined;
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

// Sadece şunları bırakabilirsiniz:
userSchema.index({email: 1}, {unique: true});
userSchema.index({ role: 1 });
userSchema.index({ 'friends': 1 });
userSchema.index({ 'conversations': 1 });

// Model zaten varsa kullan, yoksa oluştur
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
