import { defineAuthenticatedHandler } from '~/server/utils/auth';
import { getServerSession } from '~/server/utils/auth';

export default defineAuthenticatedHandler(async (event) => {
  return await getServerSession(event);
});
