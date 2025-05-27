import Food from '../models/Food';
import FoodDataService from './foodDataService';
import createError from 'http-errors';
import {
  validateFoodId,
  validateCreateFood,
  validateUpdateFood,
} from '../validations/foodValidation';
import { readBody, getQuery } from 'h3';
import { filterFoods } from '../utils/foodFilter';
import uploadUtility from '../utils/uploadUtility.js';

// Multer middleware for food photo uploads
const uploadMiddleware = uploadUtility.createMulterMiddleware({
  fieldName: 'photo',
  fileSize: 10 * 1024 * 1024, // 10MB limit
});

class FoodService {
  constructor() {
    this.usdaService = new FoodDataService();
  }

  // Besin ekle
  async addFood(event) {
    try {
      const foodData = await readBody(event);
      // Zod validasyonu yap
      const validationResult = validateCreateFood(foodData);
      if (!validationResult.success) {
        throw createError({
          statusCode: 400,
          message: 'Validasyon hatası',
          validationErrors: validationResult.error,
        });
      }

      // Validasyondan geçen veriyi kullan
      const validatedData = validationResult.data;

      // Yeni besin oluştur
      const newFood = new Food(validatedData);

      // Besini kaydet
      await newFood.save();

      return {
        success: true,
        food: newFood,
        message: 'Besin başarıyla eklendi',
      };
    } catch (error) {
      console.error('Besin ekleme hatası:', error);

      // Zaten HTTP hatası ise doğrudan fırlat
      if (error.statusCode && error.expose) {
        throw error;
      }

      // Mongoose validation hatası kontrolü
      if (error.name === 'ValidationError') {
        throw createError({
          statusCode: 400,
          message:
            'Geçersiz veri formatı: ' +
            Object.values(error.errors)
              .map((e) => e.message)
              .join(', '),
        });
      }

      // Genel hata mesajı
      throw createError({
        statusCode: 500,
        message: 'Besin eklenirken bir hata oluştu',
      });
    }
  }

  // Besin detayını getir
  async getFoodById(event) {
    const id = event.context.params.id;
    // Zod ile ID validasyonu
    const validationResult = validateFoodId(id);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz besin ID formatı',
        validationErrors: validationResult.error,
      });
    }

    try {
      //Lean() metodu sadece veri alır, modelleme yapmaz
      const food = await Food.findById(id).lean();
      if (!food) {
        throw createError({
          statusCode: 404,
          message: 'Besin bulunamadı',
        });
      }
      return food;
    } catch (error) {
      // Eğer zaten bir HTTP error ise tekrar fırlat
      if (error.statusCode && error.expose) {
        throw error;
      }
      throw createError({
        statusCode: 500,
        message: 'Besin bilgileri alınamadı',
      });
    }
  }
  // Besin sil
  async deleteFood(event) {
    const id = event.context.params.id;
    // Zod ile ID validasyonu
    const validationResult = validateFoodId(id);
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz besin ID formatı',
        validationErrors: validationResult.error,
      });
    }

    try {
      const deleted = await Food.findByIdAndDelete(id);
      if (!deleted) {
        throw createError({
          statusCode: 404,
          message: 'Besin bulunamadı',
        });
      }
      return {
        success: true,
        message: 'Besin silindi',
        deletedId: id,
      };
    } catch (error) {
      // Eğer zaten bir HTTP error ise tekrar fırlat
      if (error.statusCode && error.expose) {
        throw error;
      }
      throw createError({
        statusCode: 500,
        message: 'Besin silme başarısız',
      });
    }
  }
  // Besin güncelle
  async updateFood(event) {
    const id = event.context.params.id;
    // Zod ile ID validasyonu
    const idValidationResult = validateFoodId(id);
    if (!idValidationResult.success) {
      throw createError({
        statusCode: 400,
        message: 'Geçersiz besin ID formatı',
        validationErrors: idValidationResult.error,
      });
    }

    try {
      // Request body'den gelen verileri al
      const body = await readBody(event);

      // Zod ile güncelleme verisi validasyonu
      const validationResult = validateUpdateFood(body);
      if (!validationResult.success) {
        throw createError({
          statusCode: 400,
          message: 'Validasyon hatası',
          validationErrors: validationResult.error,
        });
      }

      // Validasyondan geçen veriyi kullan
      const validatedData = validationResult.data;

      // Besinin var olup olmadığını kontrol et
      const existingFood = await Food.findById(id);
      if (!existingFood) {
        throw createError({
          statusCode: 404,
          message: 'Güncellenecek besin bulunamadı',
        });
      }

      // Besini güncelle
      const updatedFood = await Food.findByIdAndUpdate(
        id,
        { $set: validatedData },
        { new: true, runValidators: true },
      ).lean();

      return {
        success: true,
        food: updatedFood,
        message: 'Besin başarıyla güncellendi',
      };
    } catch (error) {
      console.error('Besin güncelleme hatası:', error);

      // Zaten HTTP hatası ise doğrudan fırlat
      if (error.statusCode && error.expose) {
        throw error;
      }

      // Mongoose validation hatası kontrolü
      if (error.name === 'ValidationError') {
        throw createError({
          statusCode: 400,
          message:
            'Geçersiz veri formatı: ' +
            Object.values(error.errors)
              .map((e) => e.message)
              .join(', '),
        });
      }

      throw createError({
        statusCode: 500,
        message: 'Besin güncellenirken bir hata oluştu',
      });
    }
  }

  // Besin listesini getir
  async getFoods(event) {
    try {
      const query = getQuery(event);
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      const search = query.search || '';
      const category = query.category || '';
      const sortField = query.sortField || 'name.tr';
      const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

      // Build query
      const dbQuery = {};

      // Temel filtreler
      if (search) {
        dbQuery['$or'] = [
          { 'name.tr': { $regex: search, $options: 'i' } },
          { 'name.en': { $regex: search, $options: 'i' } },
        ];
      }
      if (category) {
        dbQuery.category = category;
      }

      // Gelişmiş filtreler
      const advancedFilters = filterFoods(query);
      if (advancedFilters && advancedFilters.length > 0) {
        // Eğer zaten $and varsa, ona ekle
        if (dbQuery.$and) {
          dbQuery.$and = [...dbQuery.$and, ...advancedFilters];
        } else {
          dbQuery.$and = advancedFilters;
        }
      }

      // Get total count for pagination
      const total = await Food.countDocuments(dbQuery);

      // Get paginated results
      const foods = await Food.find(dbQuery)
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Get category statistics
      const categories = await Food.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgCalories: { $avg: '$nutrients.energy.value' },
            avgProtein: { $avg: '$nutrients.protein.value' },
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Return response
      return {
        foods,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats: {
          categories,
          total,
        },
        // Protein kategorileri için istatistik
        proteinCategories: ['low', 'medium', 'high'],
      };
    } catch (error) {
      console.error('Error fetching foods:', error);
      throw createError({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  // Besin ara (GET metodu için)
  async searchFoodsGet(event) {
    try {
      const { q } = getQuery(event);

      if (!q) {
        return {
          foods: [],
        };
      }

      // Case-insensitive arama yapalım
      const foods = await Food.find({
        name: { $regex: q, $options: 'i' },
      })
        .select('name calories protein carbs fat')
        .limit(10);

      return {
        foods,
      };
    } catch (error) {
      console.error('Food search error:', error);
      throw createError({
        statusCode: 500,
        message: 'Besin arama sırasında bir hata oluştu',
      });
    }
  }

  // Besin ara (POST metodu için)
  async searchFoodsPost(event) {
    try {
      const body = await readBody(event);

      if (!body.query) {
        throw createError({
          statusCode: 400,
          message: 'Arama terimi gerekli',
        });
      }

      const foods = await Food.find({
        $or: [
          { 'name.tr': { $regex: body.query, $options: 'i' } },
          { name: { $regex: body.query, $options: 'i' } },
        ],
      }).limit(10);

      return { foods };
    } catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Server error',
      });
    }
  }

  // Besin ara (Genel arama metodu)
  async searchFoods(query = '', pageSize = 25, pageNumber = 1) {
    try {
      const skip = (pageNumber - 1) * pageSize;
      let searchQuery = {};

      if (query && query.trim()) {
        searchQuery = {
          $or: [
            { 'name.tr': { $regex: query, $options: 'i' } },
            { 'name.en': { $regex: query, $options: 'i' } },
          ],
        };
      }

      const [foods, totalCount] = await Promise.all([
        Food.find(searchQuery)
          .skip(skip)
          .limit(pageSize)
          .sort({ 'name.tr': 1 }),
        Food.countDocuments(searchQuery),
      ]);

      return {
        foods,
        totalHits: totalCount,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    } catch (error) {
      console.error('Error searching foods:', error);
      throw error;
    }
  }
  // USDA'dan besin verilerini MongoDB'ye aktar
  async importFromUSDA(pageSize = 100, pageNumber = 1) {
    try {
      const result = await this.usdaService.getFoodsList(pageSize, pageNumber);

      for (const usdaFood of result.foods) {
        const existingFood = await Food.findOne({
          'metadata.fdcId': usdaFood.fdcId,
        });

        if (!existingFood) {
          const food = new Food({
            name: {
              en: usdaFood.description,
              tr: usdaFood.description, // Başlangıçta İngilizce ismi kullan
            },
            nutrients: {
              energy: this.extractNutrient(usdaFood, 'Energy'),
              protein: this.extractNutrient(usdaFood, 'Protein'),
              carbohydrate: this.extractNutrient(
                usdaFood,
                'Carbohydrate, by difference',
              ),
              fat: this.extractNutrient(usdaFood, 'Total lipid (fat)'),
              fiber: this.extractNutrient(usdaFood, 'Fiber, total dietary'),
              sugar: this.extractNutrient(
                usdaFood,
                'Sugars, total including NLEA',
              ),
            },
            category: this.determineCategory(usdaFood),
            source: 'usda',
            portions: [
              {
                name: '100 gram',
                weight: 100,
                isDefault: true,
              },
            ],
            metadata: {
              fdcId: usdaFood.fdcId,
              isVerified: true,
              addedBy: 'system',
            },
          });

          await food.save();
        }
      }

      return {
        imported: result.foods.length,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error('Error importing from USDA:', error);
      throw error;
    }
  }
  // USDA besin verilerinden besin değerini çıkar
  extractNutrient(food, nutrientName) {
    const nutrient = food.foodNutrients?.find(
      (n) =>
        n.nutrientName?.toLowerCase().includes(nutrientName.toLowerCase()) ||
        n.name?.toLowerCase().includes(nutrientName.toLowerCase()),
    );

    return {
      value: nutrient ? nutrient.value || nutrient.amount || 0 : 0,
      unit: nutrient ? nutrient.unitName || 'g' : 'g',
    };
  }
  // Besin kategorisini belirle
  determineCategory(food) {
    const description = food.description.toLowerCase();

    if (
      description.includes('milk') ||
      description.includes('cheese') ||
      description.includes('yogurt')
    ) {
      return 'dairy';
    } else if (
      description.includes('meat') ||
      description.includes('chicken') ||
      description.includes('fish')
    ) {
      return 'meat';
    } else if (
      description.includes('vegetable') ||
      description.includes('carrot') ||
      description.includes('tomato')
    ) {
      return 'vegetable';
    } else if (
      description.includes('fruit') ||
      description.includes('apple') ||
      description.includes('banana')
    ) {
      return 'fruit';
    } else if (
      description.includes('bread') ||
      description.includes('rice') ||
      description.includes('pasta')
    ) {
      return 'grain';
    } else if (
      description.includes('juice') ||
      description.includes('beverage') ||
      description.includes('drink')
    ) {
      return 'beverage';
    }

    return 'other';
  }

  async uploadPhoto(event) {
    try {
      // Dosyayı al
      await uploadMiddleware(event.node.req, event.node.res);
      const file = event.node.req.file;

      if (!file) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Dosya bulunamadı' }),
        };
      }

      // Upload image using shared utility
      const uploadResult = await uploadUtility.uploadOptimizedImage(
        file.buffer,
        {
          folder: 'foods',
          optimization: {
            width: 400,
            height: 300,
            quality: 85,
          },
          format: 'jpeg',
        },
      );

      console.log('Besin fotoğrafı yüklendi:', uploadResult.url);

      return {
        url: uploadResult.url,
        fileName: uploadResult.key,
        originalSize: uploadResult.originalSize,
        optimizedSize: uploadResult.optimizedSize,
        compressionRatio: uploadResult.compressionRatio,
      };
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      return {
        statusCode: 500,
        error: 'Fotoğraf yüklenirken bir hata oluştu',
      };
    }
  }
}

const foodService = new FoodService();
export default foodService;

// Favori işlemleri favoritesService.js dosyasına taşındı

// Favori işlemleri favoritesService.js dosyasına taşındı

// Favori işlemleri favoritesService.js dosyasına taşındı
