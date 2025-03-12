import { defineEventHandler, readBody } from 'h3';
import { User } from '~/server/models/User';
import { ErrorTypes } from '~/server/utils/error';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const user = session.user;
    const updateData = await readBody(event);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        message: ErrorTypes.USER_NOT_FOUND
      });
    }

    return {
      success: true,
      user: updatedUser
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || ErrorTypes.INTERNAL_SERVER_ERROR
    });
  }
});
