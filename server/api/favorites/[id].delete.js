import { User } from '~/server/models/User';
import { ErrorTypes } from '~/server/utils/error';
import { getServerSession } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    const userId = await getServerSession(event);
    const foodId = event.context.params.id;
    
    const user = await User.findById(userId);
    
    // Check if food exists in favorites
    if (!user.favoriteFoods.includes(foodId)) {
      throw ErrorTypes.NOT_FOUND('Bu besin favorilerinizde bulunamadı');
    }
    
    user.favoriteFoods = user.favoriteFoods.filter(id => id.toString() !== foodId);
    await user.save();
    
    return { message: 'Besin favorilerden kaldırıldı' };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
});
