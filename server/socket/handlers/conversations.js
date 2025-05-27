import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import conversationService from '../../services/conversationService';
import {
  getUserConversationsKey,
  delAsync,
  getUserOnlineStatus,
} from '../../utils/redis';

export function getConversationHandlers(io, socket, connectedUsers) {
  const userId = socket.userId;

  // Helper function to emit to all user tabs
  const emitToUser = (targetUserId, event, data) => {
    const userSocketIds = connectedUsers.get(targetUserId);
    if (userSocketIds) {
      userSocketIds.forEach((socketId) => {
        io.to(socketId).emit(event, data);
      });
    }
  };

  return {
    // Kullanıcının tüm konuşmalarını getir
    get_conversations: async (data, callback) => {
      try {
        // Servis kullanarak konuşmaları getir
        const conversations =
          await conversationService.getUserConversations(userId);

        // Çevrimiçi durumlarını ekle
        const conversationsWithOnlineStatus = await Promise.all(
          conversations.map(async (conversation) => {
            const otherParticipant = conversation.participants.find(
              (p) => p._id.toString() !== userId,
            );

            if (otherParticipant) {
              // Socket.io bağlantısı varsa çevrimiçi
              const isConnected = connectedUsers.has(
                otherParticipant._id.toString(),
              );
              // Redis'ten çevrimiçi durumunu kontrol et
              const status = await getUserOnlineStatus(
                otherParticipant._id.toString(),
              );

              otherParticipant.isOnline = isConnected || status === 'online';
            }

            return conversation;
          }),
        );

        callback({ success: true, data: conversationsWithOnlineStatus });
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

        // Servis kullanarak konuşma oluştur veya mevcut konuşmayı getir
        const conversation = await conversationService.getOrCreateConversation(
          userId,
          participantId,
        );

        // Konuşmayı katılımcı detaylarıyla birlikte getir
        const populatedConversation =
          await conversationService.getConversationById(
            conversation._id,
            userId,
          );

        // Çevrimiçi durumunu ekle
        const conversationWithOnlineStatus = {
          ...populatedConversation.toObject(),
          participants: await Promise.all(
            conversationWithOnlineStatus.participants.map(
              async (participant) => {
                // Socket.io bağlantısı varsa çevrimiçi
                const isConnected = connectedUsers.has(
                  participant._id.toString(),
                );
                // Redis'ten çevrimiçi durumunu kontrol et
                const status = await getUserOnlineStatus(
                  participant._id.toString(),
                );

                return {
                  ...participant.toObject(),
                  isOnline: isConnected || status === 'online',
                };
              },
            ),
          ),
        };

        callback({
          success: true,
          data: conversationWithOnlineStatus,
          message: conversation.isNew
            ? 'New conversation created'
            : 'Existing conversation found',
        });

        // Diğer katılımcıya bildirim gönder
        emitToUser(
          participantId,
          'new_conversation',
          conversationWithOnlineStatus,
        );

        // Redis önbelleğini temizle
        await delAsync(getUserConversationsKey(userId));
        await delAsync(getUserConversationsKey(participantId));
      } catch (error) {
        console.error('Error creating conversation:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Konuşmayı arşivle
    archive_conversation: async (data, callback) => {
      try {
        const { conversationId } = data;

        if (!conversationId) {
          return callback({
            success: false,
            error: 'Conversation ID is required',
          });
        }

        // Servis kullanarak konuşmayı arşivle
        const result = await conversationService.archiveConversation(
          conversationId,
          userId,
        );

        callback({
          success: true,
          message: 'Conversation archived successfully',
        });

        // Diğer katılımcıya bildirim gönder
        const conversation = await conversationService.getConversationById(
          conversationId,
          userId,
        );
        if (conversation) {
          conversation.participants.forEach((participant) => {
            if (participant._id.toString() !== userId) {
              emitToUser(participant._id.toString(), 'conversation_archived', {
                conversationId,
              });
            }
          });
        }
      } catch (error) {
        console.error('Error archiving conversation:', error);
        callback({ success: false, error: error.message });
      }
    },
  };
}
