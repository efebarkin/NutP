// filepath: c:\Users\efeba\ProjectNut\NutP\server\services\waterService.js
import mongoose from 'mongoose';
import createError from 'http-errors';
import { Water } from '../models/Water';
import { User } from '../models/User'; // User modelini de import edelim, userId kontrolü için gerekebilir.
import {
  createWaterValidationSchema,
  updateWaterValidationSchema,
  validateWaterId,
  dateStringYYYYMMDDSchema,
} from '../validations/waterValidation';
import { readBody, getQuery } from 'h3'; // Nitro yerine h3'ün readBody ve getQuery'sini kullanalım, Nuxt 3 server route'larında daha yaygın.

/**
 * Su tüketimi takibi ile ilgili servis fonksiyonları
 */
class WaterService {
  /**
   * Yeni bir su tüketim kaydı oluşturur.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Oluşturulan su kaydı
   */
  async createWaterEntry(event) {
    const userId = event.context.auth?.user?._id;
    if (!userId) {
      throw createError(401, 'Yetkisiz erişim. Kullanıcı girişi yapılmamış.');
    }

    const body = await readBody(event);

    try {
      // Gelen veriyi valide et
      const validatedData = await createWaterValidationSchema.parseAsync({
        userId: userId.toString(), // userId'yi de validasyona dahil edelim
        amount: body.amount,
        consumedAt: body.consumedAt, // Eğer gönderilmemişse undefined olacak ve default modelde işlenecek
      });

      const newWaterEntry = new Water({
        userId: new mongoose.Types.ObjectId(validatedData.userId), // Use validated string userId
        amount: validatedData.amount,
        consumedAt: validatedData.consumedAt, // This is a Date object from Zod transform, or undefined
      });

      await newWaterEntry.save();
      return newWaterEntry.toObject(); // virtuals: true ile amountInML de döner
    } catch (error) {
      if (error.name === 'ZodError') {
        throw createError(400, 'Geçersiz veri', { issues: error.issues });
      }
      // Diğer hatalar için (örn: veritabanı hatası)
      console.error('Error creating water entry:', error); // Hata loglaması eklendi
      throw createError(
        500,
        error.message || 'Su kaydı oluşturulurken bir hata oluştu.',
      );
    }
  }

  /**
   * Kullanıcının tüm su tüketim kayıtlarını getirir.
   * @param {object} event - H3 event objesi
   * @returns {Promise<Array>} - Su kayıtları listesi
   */
  async getWaterEntries(event) {
    const userIdFromAuth = event.context.auth?.user?._id;
    if (!userIdFromAuth) {
      throw createError(401, 'Yetkisiz erişim. Kullanıcı girişi yapılmamış.');
    }

    try {
      const userObjectId = new mongoose.Types.ObjectId(
        userIdFromAuth.toString(),
      );
      const waterEntries = await Water.find({ userId: userObjectId })
        .sort({ consumedAt: -1 }) // En yeniden eskiye sırala
        .lean({ virtuals: true }); // virtuals: true ile amountInML de döner ve daha performanslıdır
      return waterEntries;
    } catch (error) {
      console.error('Error getting water entries:', error); // Hata loglaması eklendi
      throw createError(
        500,
        error.message || 'Su kayıtları getirilirken bir hata oluştu.',
      );
    }
  }

  /**
   * Belirli bir su tüketim kaydını ID ile getirir.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Bulunan su kaydı
   */
  async getWaterEntryById(event) {
    const userIdFromAuth = event.context.auth?.user?._id;
    if (!userIdFromAuth) {
      throw createError(401, 'Yetkisiz erişim. Kullanıcı girişi yapılmamış.');
    }

    const waterEntryId = event.context.params?.id;
    if (!waterEntryId) {
      throw createError(400, 'Su kaydı IDsi gerekli.');
    }

    try {
      await validateWaterId.parseAsync(waterEntryId); // ID formatını valide et
    } catch (error) {
      throw createError(400, 'Geçersiz su kaydı ID formatı.', {
        issues: error.issues,
      });
    }

    try {
      const userObjectId = new mongoose.Types.ObjectId(
        userIdFromAuth.toString(),
      );
      const waterEntry = await Water.findOne({
        _id: new mongoose.Types.ObjectId(waterEntryId), // waterEntryId is validated as string
        userId: userObjectId,
      }).lean({ virtuals: true });

      if (!waterEntry) {
        throw createError(
          404,
          'Su kaydı bulunamadı veya bu kullanıcıya ait değil.',
        );
      }
      return waterEntry;
    } catch (error) {
      console.error('Error getting water entry by ID:', error); // Hata loglaması eklendi
      if (error.statusCode === 404 || error.statusCode === 400) throw error;
      throw createError(
        500,
        error.message || 'Su kaydı getirilirken bir hata oluştu.',
      );
    }
  }

  /**
   * Mevcut bir su tüketim kaydını günceller.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Güncellenmiş su kaydı
   */
  async updateWaterEntry(event) {
    const userIdFromAuth = event.context.auth?.user?._id;
    if (!userIdFromAuth) {
      throw createError(401, 'Yetkisiz erişim. Kullanıcı girişi yapılmamış.');
    }

    const waterEntryId = event.context.params?.id;
    if (!waterEntryId) {
      throw createError(400, 'Su kaydı IDsi gerekli.');
    }

    try {
      await validateWaterId.parseAsync(waterEntryId);
    } catch (error) {
      throw createError(400, 'Geçersiz su kaydı ID formatı.', {
        issues: error.issues,
      });
    }

    const body = await readBody(event);

    try {
      const validatedData = await updateWaterValidationSchema.parseAsync(body);

      if (Object.keys(validatedData).length === 0) {
        throw createError(400, 'Güncellenecek en az bir alan gönderilmelidir.');
      }

      // consumedAt string ise Date objesine çevir (Zod transform bunu zaten yapıyor ama yine de kontrol edilebilir)
      // if (validatedData.consumedAt && typeof validatedData.consumedAt === 'string') {
      //   validatedData.consumedAt = new Date(validatedData.consumedAt);
      // }

      const userObjectId = new mongoose.Types.ObjectId(
        userIdFromAuth.toString(),
      );
      const updatedWaterEntry = await Water.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(waterEntryId), // waterEntryId is validated as string
          userId: userObjectId,
        },
        { $set: validatedData },
        { new: true, runValidators: true }, // new: true güncellenmiş dokümanı döndürür, runValidators şema validasyonlarını çalıştırır
      ).lean({ virtuals: true });

      if (!updatedWaterEntry) {
        // Kayıt bulunamadı veya kullanıcıya ait değilse, önce var olup olmadığını kontrol et
        const entryExists = await Water.findById(
          new mongoose.Types.ObjectId(waterEntryId),
        );
        if (!entryExists) {
          throw createError(404, 'Güncellenecek su kaydı bulunamadı.');
        } else {
          throw createError(403, 'Bu su kaydını güncelleme yetkiniz yok.');
        }
      }
      return updatedWaterEntry;
    } catch (error) {
      console.error('Error updating water entry:', error); // Hata loglaması eklendi
      if (error.name === 'ZodError') {
        throw createError(400, 'Geçersiz veri', { issues: error.issues });
      }
      if (
        error.statusCode === 400 ||
        error.statusCode === 403 ||
        error.statusCode === 404
      )
        throw error;
      throw createError(
        500,
        error.message || 'Su kaydı güncellenirken bir hata oluştu.',
      );
    }
  }

  /**
   * Bir su tüketim kaydını siler.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Silme işlemi sonucu
   */
  async deleteWaterEntry(event) {
    const userIdFromAuth = event.context.auth?.user?._id;
    if (!userIdFromAuth) {
      throw createError(401, 'Yetkisiz erişim. Kullanıcı girişi yapılmamış.');
    }

    const waterEntryId = event.context.params?.id;
    if (!waterEntryId) {
      throw createError(400, 'Su kaydı ID si gerekli.');
    }

    try {
      await validateWaterId.parseAsync(waterEntryId);
    } catch (error) {
      throw createError(400, 'Geçersiz su kaydı ID formatı.', {
        issues: error.issues,
      });
    }

    try {
      const userObjectId = new mongoose.Types.ObjectId(
        userIdFromAuth.toString(),
      );
      const result = await Water.deleteOne({
        _id: new mongoose.Types.ObjectId(waterEntryId), // waterEntryId is validated as string
        userId: userObjectId,
      });

      if (result.deletedCount === 0) {
        // Kayıt bulunamadı veya kullanıcıya ait değilse, önce var olup olmadığını kontrol et
        const entryExists = await Water.findById(
          new mongoose.Types.ObjectId(waterEntryId),
        );
        if (!entryExists) {
          throw createError(404, 'Silinecek su kaydı bulunamadı.');
        } else {
          throw createError(403, 'Bu su kaydını silme yetkiniz yok.');
        }
      }
      return { success: true, message: 'Su kaydı başarıyla silindi.' };
    } catch (error) {
      console.error('Error deleting water entry:', error); // Hata loglaması eklendi
      if (
        error.statusCode === 403 ||
        error.statusCode === 404 ||
        error.statusCode === 400
      )
        throw error;
      throw createError(
        500,
        error.message || 'Su kaydı silinirken bir hata oluştu.',
      );
    }
  }

  /**
   * Kullanıcının belirli bir gündeki tüm su tüketim kayıtlarını getirir ve toplar.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Günlük su tüketim özeti ve kayıtlar listesi
   */
  async getDailyWaterEntries(event) {
    const userIdFromAuth = event.context.auth?.user?._id;
    if (!userIdFromAuth) {
      throw createError(401, 'Yetkisiz erişim. Kullanıcı girişi yapılmamış.');
    }

    // Tarih parametresini al (query parameter'dan)
    const date = getQuery(event)?.date;

    if (!date) {
      throw createError(
        400,
        'Tarih parametresi gerekli. YYYY-MM-DD formatında gönderiniz.',
      );
    }

    try {
      // Tarih formatını valide et
      const validatedDate = await dateStringYYYYMMDDSchema.parseAsync(date);

      // Günün başlangıç ve bitiş tarihlerini oluştur (kullanıcının yerel saatine göre)
      const startOfDay = new Date(validatedDate + 'T00:00:00.000Z');
      const endOfDay = new Date(validatedDate + 'T23:59:59.999Z');

      const userObjectId = new mongoose.Types.ObjectId(
        userIdFromAuth.toString(),
      );

      // Belirtilen tarih aralığındaki su kayıtlarını getir
      const waterEntries = await Water.find({
        userId: userObjectId,
        consumedAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .sort({ consumedAt: 1 }) // Eski tarihten yeniye sırala (günlük timeline için)
        .lean({ virtuals: true });

      // Toplam su tüketimini hesapla (mililitre cinsinden)
      const totalWaterInML = waterEntries.reduce((total, entry) => {
        return total + (entry.amountInML || 0);
      }, 0);

      // Farklı birimlerde toplam miktarları hesapla
      const totalWaterInLiters = totalWaterInML / 1000;
      const totalWaterInGlasses = totalWaterInML / 200; // 1 bardak = 200ml

      // Kayıtları birime göre grupla
      const entriesByUnit = waterEntries.reduce((groups, entry) => {
        const unit = entry.amount?.unit || 'ml';
        if (!groups[unit]) {
          groups[unit] = [];
        }
        groups[unit].push(entry);
        return groups;
      }, {});

      // Birim başına toplam miktarları hesapla
      const summaryByUnit = {};
      Object.keys(entriesByUnit).forEach((unit) => {
        const entries = entriesByUnit[unit];
        const totalInUnit = entries.reduce((sum, entry) => {
          return sum + (entry.amount?.value || 0);
        }, 0);
        summaryByUnit[unit] = {
          count: entries.length,
          totalAmount: totalInUnit,
          entries: entries,
        };
      });

      // Günlük hedefle karşılaştırma (örnek: 2500ml günlük hedef)
      const dailyGoalML = 2500;
      const progressPercentage = Math.min(
        Math.round((totalWaterInML / dailyGoalML) * 100),
        100,
      );

      return {
        date: validatedDate,
        summary: {
          totalEntries: waterEntries.length,
          totalWaterInML: Math.round(totalWaterInML),
          totalWaterInLiters: Math.round(totalWaterInLiters * 100) / 100, // 2 decimal places
          totalWaterInGlasses: Math.round(totalWaterInGlasses * 10) / 10, // 1 decimal place
          dailyGoalML,
          progressPercentage,
          isGoalReached: totalWaterInML >= dailyGoalML,
        },
        summaryByUnit,
        entries: waterEntries,
        dateRange: {
          startOfDay: startOfDay.toISOString(),
          endOfDay: endOfDay.toISOString(),
        },
      };
    } catch (error) {
      console.error('Error getting daily water entries:', error);
      if (error.name === 'ZodError') {
        throw createError(400, 'Geçersiz tarih formatı', {
          issues: error.issues,
        });
      }
      if (error.statusCode === 400) throw error;
      throw createError(
        500,
        error.message || 'Günlük su kayıtları getirilirken bir hata oluştu.',
      );
    }
  }
}

// Singleton instance oluştur
const waterService = new WaterService();
export default waterService;
