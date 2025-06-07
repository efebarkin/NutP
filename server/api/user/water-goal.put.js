import { defineAuthenticatedHandler } from '~/server/utils/auth';
import userService from '~/server/services/userService'; // Import userService

export default defineAuthenticatedHandler(async (event) => {
  try {
    // Directly pass the event to the service method
    const result = await userService.updateUserWaterGoal(event);
    return {
      message: 'Water goal updated successfully.',
      dailyWaterGoalML: result.dailyWaterGoalML,
    };
  } catch (error) {
    // The service method should already throw errors formatted with createError.
    // So, we can often just let them propagate.
    if (error.statusCode) { // Check if it's an error created with createError
      throw error; // Re-throw the error as is
    }
    // For any other unexpected errors not from createError
    console.error('API Layer Error - Updating water goal:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred at the API layer while updating water goal.',
    });
  }
});
