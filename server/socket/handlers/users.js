import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import {
  setUserOnlineStatus,
  getUserOnlineStatus,
  delAsync,
  getUserConversationsKey,
} from '../../utils/redis';
import userService from '../../services/userService';

export function getUserHandlers(io, socket, connectedUsers) {
  const userId = socket.userId;

  // Kullanıcıyı çevrimiçi olarak işaretle
  setUserOnlineStatus(userId, 'online');

  return {
    // Kullanıcı arkadaşlarını getir
    get_friends: async (data, callback) => {
      try {
        const friends = await userService.getUserFriends(userId);
        callback({ success: true, data: friends });
      } catch (error) {
        console.error('Error fetching friends:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaş ekle
    add_friend: async (data, callback) => {
      try {
        const { friendId } = data;

        if (!friendId) {
          return callback({ success: false, error: 'Friend ID is required' });
        }

        const friend = await userService.addFriend(userId, friendId);

        callback({ success: true, data: friend });

        // Diğer kullanıcıya bildirim gönder
        const friendSocketId = connectedUsers.get(friendId);
        if (friendSocketId) {
          // Kullanıcı bilgilerini getir
          const user = await userService.getUserById(userId);

          io.to(friendSocketId).emit('friend_added', user);
        }
      } catch (error) {
        console.error('Error adding friend:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaşlıktan çıkar
    remove_friend: async (data, callback) => {
      try {
        const { friendId } = data;

        if (!friendId) {
          return callback({ success: false, error: 'Friend ID is required' });
        }

        await userService.removeFriend(userId, friendId);

        callback({ success: true });

        // Diğer kullanıcıya bildirim gönder
        const friendSocketId = connectedUsers.get(friendId);
        if (friendSocketId) {
          io.to(friendSocketId).emit('friend_removed', { userId });
        }
      } catch (error) {
        console.error('Error removing friend:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Kullanıcı ara
    search_users: async (data, callback) => {
      try {
        const { query, limit = 10 } = data;

        if (!query || query.length < 2) {
          return callback({
            success: false,
            error: 'Search query must be at least 2 characters',
          });
        }

        try {
          const users = await userService.searchUsers(query, limit, userId);
          callback({ success: true, data: users });
        } catch (searchError) {
          console.error('Error searching users:', searchError);
          callback({
            success: false,
            error: searchError.message || 'Kullanıcılar aranamadı',
          });
        }
      } catch (error) {
        console.error('Error in search_users handler:', error);
        callback({ success: false, error: 'Kullanıcılar aranamadı' });
      }
    },

    // Kullanıcı durumunu güncelle
    update_status: async (data, callback) => {
      try {
        const { status } = data;

        if (!status) {
          return callback({ success: false, error: 'Status is required' });
        }

        await userService.updateUserStatus(userId, status);

        callback({ success: true });

        // Arkadaşlara bildirim gönder
        const userWithFriends = await userService.getUserById(userId, true);

        if (
          userWithFriends &&
          userWithFriends.friends &&
          userWithFriends.friends.length > 0
        ) {
          userWithFriends.friends.forEach((friend) => {
            const friendId = friend._id.toString();
            const friendSocketId = connectedUsers.get(friendId);
            if (friendSocketId) {
              io.to(friendSocketId).emit('user_status_change', {
                userId,
                status,
              });
            }
          });
        }
      } catch (error) {
        console.error('Error updating status:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Kullanıcı bilgilerini getir
    get_user_info: async (data, callback) => {
      try {
        const { targetUserId } = data;

        if (!targetUserId) {
          return callback({ success: false, error: 'User ID is required' });
        }

        const user = await userService.getUserById(targetUserId);

        if (!user) {
          return callback({ success: false, error: 'User not found' });
        }

        callback({ success: true, data: user });
      } catch (error) {
        console.error('Error fetching user info:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Bağlantı kesildiğinde
    disconnect: async () => {
      // Kullanıcıyı çevrimdışı olarak işaretle
      await userService.updateUserStatus(userId, 'offline');

      // Arkadaşlara bildirim gönder
      const userWithFriends = await userService.getUserById(userId, true);

      if (
        userWithFriends &&
        userWithFriends.friends &&
        userWithFriends.friends.length > 0
      ) {
        userWithFriends.friends.forEach((friend) => {
          const friendId = friend._id.toString();
          const friendSocketId = connectedUsers.get(friendId);
          if (friendSocketId) {
            io.to(friendSocketId).emit('user_status_change', {
              userId,
              status: 'offline',
            });
          }
        });
      }
    },
  };
}
