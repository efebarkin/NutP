import mongoose from 'mongoose';

// Yazıyor durumu için alt şema
const typingStatusSchema = new mongoose.Schema(
  {
    isTyping: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
      default: null,
    },
    groupAvatar: {
      type: String,
      default: null,
    },
    groupAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    // Son mesaj özeti - mesaj silinse bile konuşma listesinde göstermek için
    lastMessagePreview: {
      content: {
        type: String,
        default: '',
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      type: {
        type: String,
        enum: ['text', 'image', 'file', 'audio', 'deleted', 'system'],
        default: 'text',
      },
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Yazıyor durumu kontrolü
    typing: {
      type: Map,
      of: typingStatusSchema,
      default: new Map(),
    },
    // Son aktivite zamanı
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    // Konuşma ayarları
    settings: {
      notifications: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
      pinned: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
      archived: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
      muted: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
    },
  },
  {
    timestamps: true,
  },
);

// Ensure participants are always exactly 2 users
conversationSchema.pre('save', function (next) {
  // Grup değilse 2 katılımcı olmalı
  if (!this.isGroup && this.participants.length !== 2) {
    return next(
      new Error('Non-group conversation must have exactly 2 participants'),
    );
  }

  // Grup ise en az 2 katılımcı olmalı
  if (this.isGroup && this.participants.length < 2) {
    return next(
      new Error('Group conversation must have at least 2 participants'),
    );
  }

  // Katılımcıların benzersiz olmasını sağla
  const uniqueParticipants = [
    ...new Set(this.participants.map((p) => p.toString())),
  ];
  if (uniqueParticipants.length !== this.participants.length) {
    return next(new Error('Conversation participants must be unique'));
  }

  // Son aktivite zamanını güncelle
  this.lastActivity = new Date();

  next();
});

// Yeni mesaj eklendiğinde son mesaj önizlemesini güncelle
conversationSchema.methods.updateLastMessagePreview = async function (message) {
  if (!message) return;

  let contentPreview = message.content;
  let messageType = 'text';

  // Mesaj türüne göre önizleme içeriğini ayarla
  if (message.deleted) {
    contentPreview = '[Bu mesaj silindi]';
    messageType = 'deleted';
  } else if (message.attachments && message.attachments.length > 0) {
    const attachment = message.attachments[0];

    switch (attachment.type) {
      case 'image':
        contentPreview = '📷 Fotoğraf';
        messageType = 'image';
        break;
      case 'file':
        contentPreview = `📎 Dosya: ${attachment.name || 'Dosya'}`;
        messageType = 'file';
        break;
      case 'audio':
        contentPreview = '🎵 Ses kaydı';
        messageType = 'audio';
        break;
      default:
        contentPreview = '📎 Ek';
        messageType = 'file';
    }
  }

  // Uzun mesajları kısalt
  if (contentPreview.length > 50) {
    contentPreview = contentPreview.substring(0, 47) + '...';
  }

  this.lastMessagePreview = {
    content: contentPreview,
    sender: message.sender,
    timestamp: message.createdAt || new Date(),
    type: messageType,
  };

  this.lastMessage = message._id;
  this.lastActivity = new Date();

  return this.save();
};

// Yazıyor durumunu güncelle
conversationSchema.methods.updateTypingStatus = function (userId, isTyping) {
  if (!userId) return false;

  const typingStatus = this.typing.get(userId.toString()) || {
    isTyping: false,
    lastActivity: new Date(),
  };
  typingStatus.isTyping = isTyping;
  typingStatus.lastActivity = new Date();

  this.typing.set(userId.toString(), typingStatus);
  this.markModified('typing');

  return this.save();
};

// Okunmamış mesaj sayısını sıfırla
conversationSchema.methods.resetUnreadCount = function (userId) {
  if (!userId) return false;

  this.unreadCount.set(userId.toString(), 0);
  this.markModified('unreadCount');

  return this.save();
};

// Konuşma ayarlarını güncelle
conversationSchema.methods.updateSettings = function (
  userId,
  settingType,
  value,
) {
  if (!userId || !settingType) return false;

  if (!this.settings[settingType]) {
    this.settings[settingType] = new Map();
  }

  this.settings[settingType].set(userId.toString(), value);
  this.markModified(`settings.${settingType}`);

  return this.save();
};

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ isGroup: 1 });
conversationSchema.index({ lastActivity: -1 });
conversationSchema.index({ 'settings.pinned': 1 });
conversationSchema.index({ 'settings.archived': 1 });
conversationSchema.index({ isActive: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
