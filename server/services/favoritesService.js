import { User } from '../models/User';
import { Food } from '../models/Food';
import createError from 'http-errors';
import mongoose from 'mongoose';

/**
 * Favori besinler ile ilgili servis fonksiyonları
 */
class FavoritesService {
  /**
   * Kullanıcının favori besinlerini getirir
   * @param {string} userId - Kullanıcı ID
   * @param {boolean} transform - Veriyi dönüştürme seçeneği
   * @returns {Promise<Array>} - Favori besinler listesi
   */
  async getFavoriteFoods(event) {
    try {
      const userId = event.context.auth.user._id;
      // N+1 sorgu problemini çözmek için tek bir aggregation pipeline kullanıyoruz
      // Bu, tüm ilişkili verileri tek bir sorguda getirir
      const result = await User.aggregate([
        // Kullanıcıyı bul
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        // Favori besinleri al
        { $lookup: {
          from: 'foods', // Food koleksiyonu
          localField: 'favoriteFoods',
          foreignField: '_id',
          as: 'favoriteFoodsData'
        }},
        // Kategorileri al
        { $lookup: {
          from: 'categories', // Category koleksiyonu
          localField: 'favoriteFoodsData.category',
          foreignField: '_id',
          as: 'categoriesData'
        }},
        // Sadece ihtiyacımız olan alanları seç
        { $project: {
          favoriteFoodsData: {
            _id: 1,
            name: 1,
            nutrients: 1,
            category: 1,
            portionSize: 1,
            servingSize: 1,
            image: 1
          },
          categoriesData: {
            _id: 1,
            name: 1
          }
        }}
      ]);

      // Kullanıcı bulunamadı kontrolü
      if (!result || result.length === 0) {
        throw createError({
          statusCode: 404,
          message: 'Kullanıcı bulunamadı'
        });
      }

      const user = result[0];
      const foods = user.favoriteFoodsData || [];
      const categories = user.categoriesData || [];

      // Transform the data to ensure all required fields exist
      return foods.map(food => {
        // Besinin kategorisini bul
        const foodCategory = categories.find(cat => 
          cat._id.toString() === (food.category ? food.category.toString() : null)
        );
        
        return {
          id: food._id,
          name: food.name || { tr: 'İsimsiz', en: 'Unnamed' },
          nutrients: food.nutrients || {
            energy: { value: 0, unit: 'KCAL' },
            protein: { value: 0, unit: 'G' },
            fat: { value: 0, unit: 'G' },
            carbohydrates: { value: 0, unit: 'G' },
            fiber: { value: 0, unit: 'G' },
            sugar: { value: 0, unit: 'G' }
          },
          category: foodCategory ? {
            id: foodCategory._id,
            name: foodCategory.name || { tr: 'Kategorisiz', en: 'Uncategorized' }
          } : null,
          portionSize: food.portionSize || { value: 100, unit: 'G' },
          servingSize: food.servingSize || { value: 100, unit: 'G' },
          image: food.image || null
        };
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Favori besine ekle
   * @param {string} userId - Kullanıcı ID
   * @param {string} foodId - Besin ID
   * @returns {Promise<Object>} - İşlem sonucu
   */
  async addFavoriteFood(event) {
    try {
      const userId = event.context.auth.user._id; // id yerine _id kullanıyoruz
      const { foodId } = await readBody(event);
      // Besin ID kontrolü
      if (!foodId) {
        throw createError({
          statusCode: 400,
          message: 'Besin ID\'si gerekli'
        });
      }

      // Besin ve kullanıcıyı paralel olarak kontrol et - Performans iyileştirmesi
      const [food, user] = await Promise.all([
        Food.findById(foodId),
        User.findById(userId)
      ]);

      // Besin var mı kontrol et
      if (!food) {
        throw createError({
          statusCode: 404,
          message: 'Besin bulunamadı'
        });
      }

      // Kullanıcı kontrolü
      if (!user) {
        throw createError({
          statusCode: 404,
          message: 'Kullanıcı bulunamadı'
        });
      }

      // Zaten favorilerde mi kontrol et
      if (user.favoriteFoods.includes(foodId)) {
        return {
          success: true,
          message: 'Bu besin zaten favorilerinizde',
          alreadyExists: true,
          data: {
            userId: user._id,
            foodId
          }
        };
      }

      // Favorilere ekle - save() yerine findByIdAndUpdate() kullan
      // Bu şekilde şema doğrulamaları atlanır
      await User.findByIdAndUpdate(
        userId,
        { $push: { favoriteFoods: foodId } },
        { new: true }
      );

      return {
        success: true,
        message: 'Besin favorilere eklendi',
        data: {
          userId: user._id,
          foodId
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Favorilerden besin kaldır
   * @param {string} userId - Kullanıcı ID
   * @param {string} foodId - Besin ID
   * @returns {Promise<Object>} - İşlem sonucu
   */
  async removeFavoriteFood(event) {
    try {
      const userId = event.context.auth.user._id;
      const foodId = event.context.params.id;
      const user = await User.findOne({
        _id: userId,
        favoriteFoods: { $in: [foodId] }
      });
      
      if (!user) {
        // Kullanıcı bulunamadı veya besin favorilerde değil
        // Hangi durum olduğunu kontrol et
        const userExists = await User.findById(userId);
        if (!userExists) {
          throw createError({
            statusCode: 404,
            message: 'Kullanıcı bulunamadı'
          });
        } else {
          throw createError({
            statusCode: 404,
            message: 'Bu besin favorilerinizde bulunamadı'
          });
        }
      }

      // Favorilerden kaldır - save() yerine findByIdAndUpdate() kullan
      // Bu şekilde şema doğrulamaları atlanır
      await User.findByIdAndUpdate(
        userId,
        { $pull: { favoriteFoods: foodId } },
        { new: true }
      );

      return {
        success: true,
        message: 'Besin favorilerden kaldırıldı',
        data: {
          userId: user._id,
          foodId
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance oluştur
const favoritesService = new FavoritesService();
export default favoritesService;
