import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import Friendship from '../../models/Friendship';
import User from '../../models/User';

// Helper fonksiyon: Kullanıcının tüm socket bağlantılarına mesaj gönder
const emitToUser = (io, connectedUsers, userId, event, data) => {
  const userSockets = connectedUsers.get(userId);
  if (userSockets && userSockets.size > 0) {
    userSockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
    return true;
  }
  return false;
};

export function getFriendshipHandlers(io, socket, connectedUsers) {
  const userId = socket.userId;

  return {
    // Arkadaşları getir
    get_friends: async (data, callback) => {
      try {
        if (!userId) {
          console.error('get_friends: userId bulunamadı');
          return callback({
            success: false,
            error: 'Kullanıcı kimliği bulunamadı',
          });
        }

        console.log(`Fetching friends for user: ${userId}`);

        // Kabul edilmiş arkadaşlık isteklerini bul
        const friendships = await Friendship.find({
          $or: [
            { requester: userId, status: 'accepted' },
            { recipient: userId, status: 'accepted' },
          ],
        }).lean();

        console.log(
          `Found ${friendships.length} friendships for user: ${userId}`,
        );

        if (!friendships || friendships.length === 0) {
          console.log(`No friends found for user: ${userId}`);
          return callback({ success: true, data: [] });
        }

        // Arkadaş ID'lerini topla
        const friendIds = friendships.map((friendship) =>
          friendship.requester.toString() === userId.toString()
            ? friendship.recipient
            : friendship.requester,
        );

        console.log(`Friend IDs: ${friendIds.join(', ')}`);

        // Arkadaş detaylarını getir
        const friends = await User.find(
          { _id: { $in: friendIds } },
          { password: 0, email: 0 }, // Hassas bilgileri çıkar
        ).lean();

        // Online durumunu ekle
        const friendsWithStatus = friends.map((friend) => {
          const isOnline = connectedUsers.has(friend._id.toString());
          return {
            ...friend,
            isOnline,
          };
        });

        console.log(
          `Found ${friendsWithStatus.length} friends for user: ${userId}`,
        );
        console.log('Friends data:', JSON.stringify(friendsWithStatus));

        callback({ success: true, data: friendsWithStatus });
      } catch (error) {
        console.error('Error fetching friends:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaşlık isteklerini getir
    get_friend_requests: async (data, callback) => {
      try {
        if (!userId) {
          console.error('get_friend_requests: userId bulunamadı');
          return callback({
            success: false,
            error: 'Kullanıcı kimliği bulunamadı',
          });
        }

        console.log(`Fetching friend requests for user: ${userId}`);

        // Bekleyen arkadaşlık isteklerini bul
        const requests = await Friendship.find({
          recipient: userId,
          status: 'pending',
        }).lean();

        if (!requests || requests.length === 0) {
          console.log(`No friend requests found for user: ${userId}`);
          return callback({ success: true, data: [] });
        }

        // İstek gönderen kullanıcıların ID'lerini topla
        const requesterIds = requests.map((request) => request.requester);

        // İstek gönderen kullanıcıların detaylarını getir
        const requesters = await User.find(
          { _id: { $in: requesterIds } },
          { password: 0, email: 0 }, // Hassas bilgileri çıkar
        ).lean();

        // İstek detaylarını oluştur
        const requestDetails = requesters.map((requester) => {
          const request = requests.find(
            (r) => r.requester.toString() === requester._id.toString(),
          );
          return {
            ...requester,
            requestId: request._id,
            createdAt: request.createdAt,
          };
        });

        console.log(
          `Found ${requestDetails.length} friend requests for user: ${userId}`,
        );
        callback({ success: true, data: requestDetails });
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Gönderilen arkadaşlık isteklerini getir
    get_sent_requests: async (data, callback) => {
      try {
        if (!userId) {
          console.error('get_sent_requests: userId bulunamadı');
          return callback({
            success: false,
            error: 'Kullanıcı kimliği bulunamadı',
          });
        }

        console.log(`Fetching sent friend requests for user: ${userId}`);

        // Kullanıcının gönderdiği bekleyen istekleri bul
        const sentRequests = await Friendship.find({
          requester: userId,
          status: 'pending',
        }).lean();

        if (!sentRequests || sentRequests.length === 0) {
          console.log(`No sent requests found for user: ${userId}`);
          return callback({ success: true, data: [] });
        }

        // Alıcı kullanıcıların ID'lerini topla
        const recipientIds = sentRequests.map((request) => request.recipient);

        // Alıcı kullanıcıların detaylarını getir
        const recipients = await User.find(
          { _id: { $in: recipientIds } },
          { password: 0, email: 0 }, // Hassas bilgileri çıkar
        ).lean();

        // İstek detaylarını oluştur
        const requestDetails = recipients.map((recipient) => {
          const request = sentRequests.find(
            (r) => r.recipient.toString() === recipient._id.toString(),
          );
          return {
            ...recipient,
            requestId: request._id,
            createdAt: request.createdAt,
          };
        });

        console.log(
          `Found ${requestDetails.length} sent requests for user: ${userId}`,
        );
        callback({ success: true, data: requestDetails });
      } catch (error) {
        console.error('Error fetching sent requests:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaşlık isteği gönder
    send_friend_request: async (data, callback) => {
      try {
        if (!userId) {
          console.error('send_friend_request: userId bulunamadı');
          return callback({
            success: false,
            error: 'Kullanıcı kimliği bulunamadı',
          });
        }

        const { recipientId } = data;

        if (!recipientId) {
          console.error('Arkadaşlık isteği için recipientId gerekli');
          return callback({ success: false, error: "Alıcı ID'si gerekli" });
        }

        if (recipientId === userId) {
          console.error('Kullanıcı kendisine arkadaşlık isteği gönderemez');
          return callback({
            success: false,
            error: 'Kendinize arkadaşlık isteği gönderemezsiniz',
          });
        }

        console.log(
          `Arkadaşlık isteği gönderiliyor: ${userId} -> ${recipientId}`,
        );

        // Kullanıcının varlığını kontrol et
        const recipient = await User.findById(recipientId);
        if (!recipient) {
          console.error(`Alıcı kullanıcı bulunamadı: ${recipientId}`);
          return callback({
            success: false,
            error: 'Alıcı kullanıcı bulunamadı',
          });
        }

        // Mevcut bir arkadaşlık ilişkisi var mı kontrol et
        const existingFriendship = await Friendship.findOne({
          $or: [
            { requester: userId, recipient: recipientId },
            { requester: recipientId, recipient: userId },
          ],
        }).lean();

        if (existingFriendship) {
          console.log('Mevcut arkadaşlık durumu:', existingFriendship.status);

          // Zaten arkadaşlarsa
          if (existingFriendship.status === 'accepted') {
            return callback({
              success: false,
              error: 'Bu kullanıcı zaten arkadaşınız',
              existingStatus: existingFriendship.status,
            });
          }

          // Zaten istek gönderilmişse
          if (
            existingFriendship.status === 'pending' &&
            existingFriendship.requester.toString() === userId.toString()
          ) {
            return callback({
              success: false,
              error: 'Bu kullanıcıya zaten arkadaşlık isteği gönderdiniz',
              existingStatus: existingFriendship.status,
            });
          }

          // Karşı taraftan gelen bir istek varsa
          if (
            existingFriendship.status === 'pending' &&
            existingFriendship.recipient.toString() === userId.toString()
          ) {
            return callback({
              success: false,
              error: 'Bu kullanıcı size zaten arkadaşlık isteği göndermiş',
              existingStatus: existingFriendship.status,
              requestId: existingFriendship._id,
            });
          }

          // Reddedilmiş bir istek varsa, güncelle
          if (existingFriendship.status === 'rejected') {
            const updatedFriendship = await Friendship.findByIdAndUpdate(
              existingFriendship._id,
              {
                status: 'pending',
                requester: userId,
                recipient: recipientId,
                updatedAt: new Date(),
              },
              { new: true },
            ).lean();

            console.log(
              'Reddedilmiş arkadaşlık isteği güncellendi:',
              updatedFriendship._id,
            );

            // Alıcıya bildirim gönder
            const recipientSocket = connectedUsers.get(recipientId.toString());
            if (recipientSocket) {
              io.to(recipientSocket).emit('friend_request_received', {
                requestId: updatedFriendship._id,
                requester: await User.findById(userId, {
                  password: 0,
                  email: 0,
                }).lean(),
              });
            }

            return callback({
              success: true,
              message: 'Arkadaşlık isteği gönderildi',
              requestId: updatedFriendship._id,
            });
          }
        }

        // Yeni arkadaşlık isteği oluştur
        const newFriendship = new Friendship({
          requester: userId,
          recipient: recipientId,
          status: 'pending',
        });

        await newFriendship.save();

        console.log('Yeni arkadaşlık isteği oluşturuldu:', newFriendship._id);

        // Alıcıya bildirim gönder
        const recipientSocket = connectedUsers.get(recipientId.toString());
        if (recipientSocket) {
          const requesterInfo = await User.findById(userId, {
            password: 0,
            email: 0,
          }).lean();
          io.to(recipientSocket).emit('friend_request_received', {
            requestId: newFriendship._id,
            requester: requesterInfo,
          });
        }

        callback({
          success: true,
          message: 'Arkadaşlık isteği gönderildi',
          requestId: newFriendship._id,
        });
      } catch (error) {
        console.error('Arkadaşlık isteği gönderme hatası:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaşlık isteğini kabul et
    accept_friend_request: async (data, callback) => {
      try {
        if (!userId) {
          console.error('accept_friend_request: userId bulunamadı');
          return callback({
            success: false,
            error: 'Kullanıcı kimliği bulunamadı',
          });
        }

        const { requestId } = data;

        if (!requestId) {
          console.error('Arkadaşlık isteği kabul için requestId gerekli');
          return callback({ success: false, error: "İstek ID'si gerekli" });
        }

        console.log(
          `Arkadaşlık isteği kabul ediliyor, requestId: ${requestId}, userId: ${userId}`,
        );

        // İsteği bul
        const friendRequest = await Friendship.findById(requestId);

        if (!friendRequest) {
          console.error(`Arkadaşlık isteği bulunamadı: ${requestId}`);
          return callback({
            success: false,
            error: 'Arkadaşlık isteği bulunamadı',
          });
        }

        // İsteğin bu kullanıcıya ait olduğunu kontrol et
        if (friendRequest.recipient.toString() !== userId.toString()) {
          console.error('Bu arkadaşlık isteğini kabul etme yetkiniz yok');
          return callback({
            success: false,
            error: 'Bu arkadaşlık isteğini kabul etme yetkiniz yok',
          });
        }

        // İsteğin durumunu kontrol et
        if (friendRequest.status !== 'pending') {
          console.error(`Geçersiz istek durumu: ${friendRequest.status}`);
          return callback({
            success: false,
            error: `Bu istek zaten ${friendRequest.status === 'accepted' ? 'kabul edilmiş' : 'reddedilmiş'}`,
          });
        }

        // İsteği kabul et
        friendRequest.status = 'accepted';
        friendRequest.updatedAt = new Date();
        await friendRequest.save();

        console.log('Arkadaşlık isteği kabul edildi:', requestId);

        // İstek gönderen kullanıcıyı bul
        const requester = await User.findById(friendRequest.requester, {
          password: 0,
          email: 0,
        }).lean();
        const recipient = await User.findById(friendRequest.recipient, {
          password: 0,
          email: 0,
        }).lean();

        if (!requester || !recipient) {
          console.error('Kullanıcı bilgileri bulunamadı');
          return callback({
            success: true,
            message:
              'Arkadaşlık isteği kabul edildi, ancak kullanıcı bilgileri alınamadı',
            requestId: friendRequest._id,
          });
        }

        // Online durumunu ekle
        const requesterIsOnline = connectedUsers.has(requester._id.toString());
        const recipientIsOnline = connectedUsers.has(recipient._id.toString());

        const requesterWithStatus = {
          ...requester,
          isOnline: requesterIsOnline,
        };

        const recipientWithStatus = {
          ...recipient,
          isOnline: recipientIsOnline,
        };

        // Tüm bağlı kullanıcıları logla
        console.log(
          'Bağlı kullanıcılar:',
          Array.from(connectedUsers.entries()),
        );

        // İstek gönderene bildirim gönder
        const requesterSocket = connectedUsers.get(
          friendRequest.requester.toString(),
        );
        if (requesterSocket) {
          console.log(
            'İstek gönderene bildirim gönderiliyor:',
            friendRequest.requester.toString(),
          );
          io.to(requesterSocket).emit('friend_request_accepted', {
            requestId: friendRequest._id,
            friend: recipientWithStatus,
          });
        } else {
          console.log(
            'İstek gönderen bağlı değil:',
            friendRequest.requester.toString(),
          );
        }

        // Alıcıya da (kabul eden kişiye) bildirim gönder
        const recipientSocket = connectedUsers.get(
          friendRequest.recipient.toString(),
        );
        if (recipientSocket) {
          console.log(
            'Alıcıya bildirim gönderiliyor:',
            friendRequest.recipient.toString(),
          );
          io.to(recipientSocket).emit('friend_request_accepted', {
            requestId: friendRequest._id,
            friend: requesterWithStatus,
          });
        } else {
          console.log('Alıcı bağlı değil:', friendRequest.recipient.toString());
        }

        // Başarılı yanıt döndür
        callback({
          success: true,
          message: 'Arkadaşlık isteği kabul edildi',
          friend: requesterWithStatus,
          requestId: friendRequest._id,
        });
      } catch (error) {
        console.error('Arkadaşlık isteği kabul hatası:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaşlık isteğini reddet
    reject_friend_request: async (data, callback) => {
      try {
        const { requestId } = data;

        if (!requestId) {
          return callback({ success: false, error: 'Request ID is required' });
        }

        // İsteği bul ve kontrol et
        const request = await Friendship.findById(requestId);

        if (!request) {
          return callback({
            success: false,
            error: 'Friend request not found',
          });
        }

        if (request.recipient.toString() !== userId) {
          return callback({
            success: false,
            error: 'You are not authorized to reject this request',
          });
        }

        if (request.status !== 'pending') {
          return callback({
            success: false,
            error: 'This request is not pending',
          });
        }

        // İsteği reddet
        request.status = 'rejected';
        await request.save();

        callback({ success: true, data: { requestId: request._id } });

        // İstek gönderene bildirim gönder
        const requesterSocketId = connectedUsers.get(
          request.requester.toString(),
        );
        if (requesterSocketId) {
          io.to(requesterSocketId).emit('friend_request_rejected', {
            requestId: request._id,
          });
        }
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaşlık isteğini iptal et
    cancel_friend_request: async (data, callback) => {
      try {
        const { requestId } = data;

        if (!requestId) {
          return callback({ success: false, error: 'Request ID is required' });
        }

        // İsteği bul ve kontrol et
        const request = await Friendship.findById(requestId);

        if (!request) {
          return callback({
            success: false,
            error: 'Friend request not found',
          });
        }

        if (request.requester.toString() !== userId) {
          return callback({
            success: false,
            error: 'You are not authorized to cancel this request',
          });
        }

        if (request.status !== 'pending') {
          return callback({
            success: false,
            error: 'This request is not pending',
          });
        }

        // İsteği sil
        await Friendship.findByIdAndDelete(requestId);

        callback({ success: true, data: { requestId } });

        // Alıcıya bildirim gönder
        const recipientSocketId = connectedUsers.get(
          request.recipient.toString(),
        );
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('friend_request_canceled', {
            requestId,
          });
        }
      } catch (error) {
        console.error('Error canceling friend request:', error);
        callback({ success: false, error: error.message });
      }
    },

    // Arkadaşı kaldır
    remove_friend: async (data, callback) => {
      try {
        const { friendId } = data;

        if (!friendId) {
          return callback({ success: false, error: 'Friend ID is required' });
        }

        // Arkadaşlık ilişkisini bul
        const friendship = await Friendship.findOne({
          $or: [
            { requester: userId, recipient: friendId, status: 'accepted' },
            { requester: friendId, recipient: userId, status: 'accepted' },
          ],
        });

        if (!friendship) {
          return callback({ success: false, error: 'Friendship not found' });
        }

        // Arkadaşlık ilişkisini sil
        await Friendship.findByIdAndDelete(friendship._id);

        callback({ success: true, data: { friendId } });

        // Diğer kullanıcıya bildirim gönder
        const otherUserSocketId = connectedUsers.get(friendId);
        if (otherUserSocketId) {
          io.to(otherUserSocketId).emit('friend_removed', {
            friendId: userId,
          });
        }
      } catch (error) {
        console.error('Error removing friend:', error);
        callback({ success: false, error: error.message });
      }
    },
  };
}
