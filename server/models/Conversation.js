import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  //yaziyor kontrolu
  typing: {
    type: Map,
    of: Boolean,
    default: new Map()
  }
}, {
  timestamps: true
});

// Ensure participants are always exactly 2 users
conversationSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Conversation must have exactly 2 participants'));
  }
  
  // Ensure participants are unique
  const uniqueParticipants = [...new Set(this.participants.map(p => p.toString()))];
  if (uniqueParticipants.length !== 2) {
    return next(new Error('Conversation participants must be unique'));
  }
  
  next();
});

// Create a unique index on participants to ensure no duplicate conversations
conversationSchema.index({ participants: 1 }, { unique: true });

// Index for faster queries
conversationSchema.index({ 'participants': 1, 'updatedAt': -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
