import mongoose from 'mongoose';

// Mesaj durumu güncellemeleri için alt şema
const statusUpdateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Hangi kullanıcı tarafından güncellendiği
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { _id: false },
);

// Tepkiler için alt şema
const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

// Ekler için alt şema
const attachmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'file', 'audio', 'video', 'location', 'contact'],
      default: 'file',
    },
    url: String,
    name: String,
    size: Number,
    mimeType: String,
    duration: Number, // Ses ve video için süre (saniye)
    width: Number, // Resim ve video için genişlik
    height: Number, // Resim ve video için yükseklik
    thumbnail: String, // Küçük resim URL'si
    // Konum için
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    // Kişi için
    contact: {
      name: String,
      phone: String,
      email: String,
    },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent',
    },
    statusUpdates: [statusUpdateSchema],
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    reactions: [reactionSchema],
    attachments: [attachmentSchema],
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // Mesaj türü
    messageType: {
      type: String,
      enum: ['text', 'media', 'system', 'reply'],
      default: 'text',
    },
    // Yanıt verilen mesaj
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    // Mesaj okunma bilgileri
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Mesaj iletilme bilgileri
    deliveredTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedFor: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        deletedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Mesaj için özel meta veriler
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map(),
    },
    // Mesajın düzenlenip düzenlenmediği
    edited: {
      type: Boolean,
      default: false,
    },
    // Düzenleme geçmişi
    editHistory: [
      {
        content: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Mesaj durumunu güncelleme yardımcı metodu
messageSchema.methods.updateStatus = async function (status, userId) {
  // Geçerli durumları kontrol et
  const validStatuses = ['sent', 'delivered', 'read', 'failed'];
  if (!validStatuses.includes(status)) {
    throw new Error('Geçersiz mesaj durumu');
  }

  // Durum güncellemesini ekle
  this.statusUpdates.push({
    status,
    timestamp: new Date(),
    updatedBy: userId,
  });

  // Ana durum alanını güncelle
  this.status = status;

  // Durum tipine göre ilgili alanları güncelle
  if (status === 'read') {
    // Eğer bu kullanıcı için okunma kaydı yoksa ekle
    if (
      !this.readBy.some((item) => item.user.toString() === userId.toString())
    ) {
      this.readBy.push({
        user: userId,
        readAt: new Date(),
      });
    }
  } else if (status === 'delivered') {
    // Eğer bu kullanıcı için iletilme kaydı yoksa ekle
    if (
      !this.deliveredTo.some(
        (item) => item.user.toString() === userId.toString(),
      )
    ) {
      this.deliveredTo.push({
        user: userId,
        deliveredAt: new Date(),
      });
    }
  }

  return this.save();
};

// Mesajı düzenleme yardımcı metodu
messageSchema.methods.editContent = async function (newContent, userId) {
  // Sadece gönderen düzenleyebilir
  if (this.sender.toString() !== userId.toString()) {
    throw new Error('Bu mesajı düzenleme yetkiniz yok');
  }

  // Mesaj silinmişse düzenlenemez
  if (this.deleted) {
    throw new Error('Silinmiş mesaj düzenlenemez');
  }

  // Eski içeriği geçmişe ekle
  this.editHistory.push({
    content: this.content,
    editedAt: new Date(),
  });

  // Yeni içeriği ayarla
  this.content = newContent;
  this.edited = true;

  return this.save();
};

// Mesaja tepki ekleme yardımcı metodu
messageSchema.methods.addReaction = async function (emoji, userId) {
  // Aynı kullanıcının aynı emojiyi tekrar eklemesini engelle
  const existingReaction = this.reactions.find(
    (r) => r.user.toString() === userId.toString() && r.emoji === emoji,
  );

  if (existingReaction) {
    // Varolan tepkiyi kaldır (toggle)
    this.reactions = this.reactions.filter(
      (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji),
    );
  } else {
    // Yeni tepki ekle
    this.reactions.push({
      user: userId,
      emoji,
      createdAt: new Date(),
    });
  }

  return this.save();
};

messageSchema.methods.softDelete = function (userId) {
  // Mesaj bu kullanıcı için silindi işaretleniyor
  if (
    !this.deletedFor.some((item) => item.user.toString() === userId.toString())
  ) {
    this.deletedFor.push({
      user: userId,
      deletedAt: new Date(),
    });
  }

  // Tüm kullanıcılar için silindiyse içeriği anonim hale getir
  const allParticipantsDeleted = this.conversationId.participants.every(
    (participant) =>
      this.deletedFor.some(
        (item) => item.user.toString() === participant.toString(),
      ),
  );

  if (allParticipantsDeleted) {
    this.content = '[Bu mesaj silindi]';
    this.attachments = [];
    this.deleted = true;
  }

  return this.save();
};

// Mesaj içeriğini kontrol et ve mesaj türünü belirle
messageSchema.pre('save', function (next) {
  // Yeni oluşturulan mesajlar için
  if (this.isNew) {
    // Ekler varsa mesaj türünü belirle
    if (this.attachments && this.attachments.length > 0) {
      this.messageType = 'media';
    }

    // Yanıt mesajı ise
    if (this.replyTo) {
      this.messageType = 'reply';
    }
  }

  next();
});

// Indexes for faster queries
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, status: 1 });
messageSchema.index({ 'readBy.user': 1 });
messageSchema.index({ 'deliveredTo.user': 1 });
messageSchema.index({ messageType: 1 });
messageSchema.index({ deleted: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
