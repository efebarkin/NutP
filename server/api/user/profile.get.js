import { defineEventHandler } from 'h3';
import { User } from '~/server/models/User';
import { ErrorTypes } from '~/server/utils/error';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const user = session.user;

    const profile = await User.findById(user._id).select('-password'); // id yerine _id kullanıyoruz

    if (!profile) {
      throw createError({
        statusCode: 404,
        message: ErrorTypes.USER_NOT_FOUND
      });
    }

    return {
      success: true,
      user: profile
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR
    });
  }
});
