import { eventHandler, readBody } from 'h3';
import bcrypt from 'bcrypt';
import { User } from '~/server/models/user';
import { verifyToken } from '~/server/utils/auth';
import { ErrorTypes } from '~/server/utils/error';

export default eventHandler(async (event) => {
  try {
    const userId = await verifyToken(event);
    const { name, email, currentPassword, newPassword } = await readBody(event);

    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      throw ErrorTypes.NOT_FOUND('Kullanıcı bulunamadı');
    }

    // Eğer email değiştiriliyorsa, yeni email'in kullanılmadığından emin ol
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw ErrorTypes.VALIDATION('Bu email adresi zaten kullanımda');
      }
    }

    // Şifre değiştiriliyorsa mevcut şifreyi kontrol et
    if (newPassword) {
      if (!currentPassword) {
        throw ErrorTypes.VALIDATION('Mevcut şifrenizi girmelisiniz');
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw ErrorTypes.UNAUTHORIZED('Mevcut şifre hatalı');
      }

      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    // Kullanıcı bilgilerini güncelle
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    // Hassas bilgileri kaldır
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return { user: userResponse };
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.statusCode) {
      throw error;
    }
    throw ErrorTypes.INTERNAL('Profil güncellenirken bir hata oluştu');
  }
});
