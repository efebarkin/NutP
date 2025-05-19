import { defineEventHandler } from 'h3';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    return session;
  } catch (error) {
    throw error;
  }
});
