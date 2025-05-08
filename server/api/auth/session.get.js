import { defineEventHandler } from 'h3';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  console.log('[API /api/auth/session.get.js] Handler started. Using defineEventHandler.');
  try {
    const session = await getServerSession(event);
    console.log('[API /api/auth/session.get.js] getServerSession returned:', session ? { userId: session.user?._id, userName: session.user?.name } : null);
    return session;
  } catch (error) {
    console.error('[API /api/auth/session.get.js] Error in handler:', error);
    throw error;
  }
});
