import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import messageService from '../../services/messageService';
import conversationService from '../../services/conversationService';
import {
  setUserOnlineStatus,
  setTypingStatus,
  getUserOnlineStatus,
  cacheMessage,
} from '../../utils/redis';

export function getMessageHandlers(io, socket, connectedUsers) {
  const userId = socket.userId;

  // Kullanıcıyı çevrimiçi olarak işaretle
  setUserOnlineStatus(userId, 'online');

  return {
    // Konuşmaya ait mesajları getir
    get_messages: async (data, callback) => {
      try {
        const { conversationId, limit = 50, skip = 0 } = data;

        if (!conversationId) {
          return callback({
            success: false,
            error: 'Conversation ID is required',
          });
        }

        // Servis kullanarak mesajları getir
        const messages = await messageService.getMessages(
          conversationId,
          limit,
          skip,
        );

        callback({ success: true, data: messages });

        // Mesajları okundu olarak işaretle
        await messageService.markAllAsRead(userId, conversationId);

        // Diğer katılımcıya bildirim gönder
        const conversation = await conversationService.getConversationById(
          conversationId,
          userId,
        );

        if (conversation) {
          conversation.participants.forEach((participant) => {
            if (participant._id.toString() !== userId) {
              const participantSocketId = connectedUsers.get(
                participant._id.toString(),
              );
              if (participantSocketId) {
                io.to(participantSocketId).emit('messages_read', {
                  conversationId,
                  readBy: userId,
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Yeni mesaj gönder
    send_message: async (data) => {
      try {
        const { conversationId, content, attachments = [] } = data;

        if (!conversationId || !content) {
          return;
        }

        // Konuşmayı kontrol et
        const conversation = await conversationService.getConversationById(
          conversationId,
          userId,
        );

        if (!conversation) {
          return;
        }

        // Alıcıyı belirle
        const receiver = conversation.participants.find(
          (p) => p._id.toString() !== userId,
        );

        if (!receiver) {
          return;
        }

        // Mesaj nesnesini oluştur
        const messageData = {
          sender: userId,
          receiver: receiver._id,
          content,
          conversationId,
          attachments,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Servis kullanarak mesajı kaydet
        const message = await messageService.createMessage(messageData);

        // Mesajı gönderen kullanıcıya bildir
        socket.emit('new_message', message);

        // Alıcıya bildir
        const receiverSocketId = connectedUsers.get(receiver._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },

    // Mesajları okundu olarak işaretle
    mark_messages_read: async (data) => {
      try {
        const { conversationId, messageIds } = data;

        if (!conversationId) {
          return;
        }

        // Tüm mesajları okundu olarak işaretle
        if (!messageIds || messageIds.length === 0) {
          await messageService.markAllAsRead(userId, conversationId);
        } else {
          // Belirli mesajları okundu olarak işaretle
          for (const messageId of messageIds) {
            await messageService.markAsRead(messageId);
          }
        }

        // Diğer katılımcıya bildirim gönder
        const conversation = await conversationService.getConversationById(
          conversationId,
          userId,
        );

        if (conversation) {
          conversation.participants.forEach((participant) => {
            if (participant._id.toString() !== userId) {
              const participantSocketId = connectedUsers.get(
                participant._id.toString(),
              );
              if (participantSocketId) {
                io.to(participantSocketId).emit('messages_read', {
                  conversationId,
                  readBy: userId,
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    },

    // Yazıyor durumunu bildir
    typing: async (data) => {
      try {
        const { conversationId, isTyping } = data;

        if (!conversationId) {
          return;
        }

        // Redis ve MongoDB'de yazıyor durumunu güncelle
        await messageService.setTypingStatus(conversationId, userId, isTyping);

        // Diğer katılımcıya bildir
        const conversation = await conversationService.getConversationById(
          conversationId,
          userId,
        );

        if (conversation) {
          conversation.participants.forEach((participant) => {
            if (participant._id.toString() !== userId) {
              const participantSocketId = connectedUsers.get(
                participant._id.toString(),
              );
              if (participantSocketId) {
                io.to(participantSocketId).emit('user_typing', {
                  conversationId,
                  userId,
                  isTyping,
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Error broadcasting typing status:', error);
      }
    },

    // Bağlantı kesildiğinde
    disconnect: async () => {
      // Kullanıcıyı çevrimdışı olarak işaretle
      await setUserOnlineStatus(userId, 'offline');
    },

    // Kullanıcının arkadaşlarını getir
    get_friends: async (data, callback) => {
      try {
        const friends = await messageService.getFriends(userId);
        callback({ success: true, data: friends });
      } catch (error) {
        console.error('Error fetching friends:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Kullanıcının konuşmalarını getir
    get_conversations: async (data, callback) => {
      try {
        const { limit = 10, skip = 0 } = data;
        const conversations = await messageService.getConversations(
          userId,
          limit,
          skip,
        );
        callback({ success: true, data: conversations });
      } catch (error) {
        console.error('Error fetching conversations:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Yeni konuşma oluştur
    create_conversation: async (data, callback) => {
      try {
        const { participantId } = data;

        if (!participantId) {
          return callback({
            success: false,
            error: 'Participant ID is required',
          });
        }

        const conversation = await messageService.createConversation(
          userId,
          participantId,
        );
        callback({ success: true, data: conversation });
      } catch (error) {
        console.error('Error creating conversation:', error);
        callback({ success: false, error: error.message });
      }
    },
  };
}
