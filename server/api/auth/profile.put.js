import { defineEventHandler, readBody } from 'h3';
import { User } from '~/server/models/User';
import { ErrorTypes } from '~/server/utils/error';
import { getServerSession } from '~/server/utils/auth';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  try {
    // Get user from context (set by auth middleware)
    const currentUser = event.context.user;
    if (!currentUser) {
      throw ErrorTypes.UNAUTHORIZED('Kullanıcı bulunamadı');
    }

    const body = await readBody(event);
    const updates = {};

    // Validate and sanitize input
    if (body.name) {
      if (typeof body.name !== 'string' || body.name.length < 2) {
        throw ErrorTypes.BAD_REQUEST('İsim en az 2 karakter olmalıdır');
      }
      updates.name = body.name.trim();
    }

    if (body.email) {
      if (typeof body.email !== 'string' || !body.email.includes('@')) {
        throw ErrorTypes.BAD_REQUEST('Geçerli bir email adresi giriniz');
      }
      
      // Check if email is already in use by another user
      const existingUser = await User.findOne({ 
        email: body.email.toLowerCase(),
        _id: { $ne: currentUser._id }
      });
      
      if (existingUser) {
        throw ErrorTypes.BAD_REQUEST('Bu email adresi zaten kullanımda');
      }
      
      updates.email = body.email.toLowerCase();
    }

    if (body.currentPassword && body.newPassword) {
      // Verify current password
      const user = await User.findById(currentUser._id);
      const isValidPassword = await bcrypt.compare(body.currentPassword, user.password);
      
      if (!isValidPassword) {
        throw ErrorTypes.BAD_REQUEST('Mevcut şifre hatalı');
      }

      if (typeof body.newPassword !== 'string' || body.newPassword.length < 6) {
        throw ErrorTypes.BAD_REQUEST('Yeni şifre en az 6 karakter olmalıdır');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(body.newPassword, salt);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updates },
      { new: true, select: '-password -refreshToken' }
    );

    if (!updatedUser) {
      throw ErrorTypes.NOT_FOUND('Kullanıcı bulunamadı');
    }

    // Get current tokens from headers
    const currentAccessToken = event.node.req.headers['authorization']?.replace('Bearer ', '');
    const currentRefreshToken = event.node.req.headers['refresh-token'];

    // Set current tokens in response headers to maintain session
    if (currentAccessToken) {
      event.node.res.setHeader('Access-Token', currentAccessToken);
    }
    if (currentRefreshToken) {
      event.node.res.setHeader('Refresh-Token', currentRefreshToken);
    }

    return {
      success: true,
      message: 'Profil başarıyla güncellendi',
      user: updatedUser
    };
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
});
