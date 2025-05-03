import conversationService from '../../services/conversationService';
import { defineAuthenticatedHandler } from '../../utils/auth';

export default defineAuthenticatedHandler(async (event) => {
    return conversationService.getUserConversations(event);
});
