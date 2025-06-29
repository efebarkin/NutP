// filepath: c:\Users\efeba\ProjectNut\NutP\server\services\waterService.js
import mongoose from 'mongoose';
import createError from 'http-errors';
import { Water } from '../models/Water';
import User from '../models/User.js';
import {
  createWaterValidationSchema,
  updateWaterValidationSchema,
  validateWaterId,
  dateStringYYYYMMDDSchema,
} from '../validations/waterValidation';
import { readBody, getQuery } from 'h3';

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
    // Auth middleware garantisi ile user her zaman mevcut
    const userId = event.context.auth.user._id;

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
    // Auth middleware garantisi ile user her zaman mevcut
    const userIdFromAuth = event.context.auth.user._id;

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
    // Auth middleware garantisi ile user her zaman mevcut
    const userIdFromAuth = event.context.auth.user._id;

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
    // Auth middleware garantisi ile user her zaman mevcut
    const userIdFromAuth = event.context.auth.user._id;

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
    // Auth middleware garantisi ile user her zaman mevcut
    const userIdFromAuth = event.context.auth.user._id;

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
    // Auth middleware garantisi ile user her zaman mevcut
    const userIdFromAuth = event.context.auth.user._id;

    // Tarih parametresini al (query parameter'dan)
    const date = getQuery(event)?.date;
    const timezone = getQuery(event)?.timezone || 'UTC'; // Default to UTC if not provided

    if (!date) {
      throw createError(
        400,
        'Tarih parametresi gerekli. YYYY-MM-DD formatında gönderiniz.',
      );
    }

    try {
      // Tarih formatını valide et
      const validatedDate = await dateStringYYYYMMDDSchema.parseAsync(date);

      // Kullanıcının lokal timezone'ına göre günün başlangıç ve bitiş tarihlerini oluştur
      // T00:00:00 ile T23:59:59.999 arasındaki tüm kayıtları al (timezone suffix olmadan)
      const startOfDay = new Date(validatedDate + 'T00:00:00');
      const endOfDay = new Date(validatedDate + 'T23:59:59.999');

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

  /**
   * Kullanıcının belirli bir tarih aralığındaki günlük su tüketim özetlerini getirir.
   * Takvim görünümü için kullanılır.
   * @param {object} event - H3 event objesi
   * @returns {Promise<object>} - Tarih aralığındaki günlük su tüketim özetleri
   */
  async getWaterEntriesByDateRange(event) {
    // Auth middleware garantisi ile user her zaman mevcut
    const userIdFromAuth = event.context.auth.user._id;

    // Tarih aralığı parametrelerini al
    const { startDate, endDate, timezone } = getQuery(event);

    if (!startDate || !endDate) {
      throw createError(
        400,
        'Başlangıç ve bitiş tarihleri gerekli. YYYY-MM-DD formatında gönderiniz.',
      );
    }

    try {
      // Import the dateRangeSchema
      const { dateRangeSchema } = await import(
        '../validations/waterValidation.js'
      );

      // Tarih aralığını valide et
      const validatedDateRange = await dateRangeSchema.parseAsync({
        startDate,
        endDate,
      });

      // Tarih aralığının başlangıç ve bitiş tarihlerini oluştur (local timezone)
      const startOfRange = new Date(validatedDateRange.startDate + 'T00:00:00');
      const endOfRange = new Date(validatedDateRange.endDate + 'T23:59:59.999');

      const userObjectId = new mongoose.Types.ObjectId(
        userIdFromAuth.toString(),
      );

      // Belirtilen tarih aralığındaki tüm su kayıtlarını getir
      const waterEntries = await Water.find({
        userId: userObjectId,
        consumedAt: {
          $gte: startOfRange,
          $lte: endOfRange,
        },
      })
        .sort({ consumedAt: 1 })
        .lean({ virtuals: true });

      // Günlük özetleri oluştur
      const dailySummaries = {};

      // Önce tüm günleri başlat
      const currentDate = new Date(startOfRange);
      while (currentDate <= endOfRange) {
        // Use local date formatting instead of UTC
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        dailySummaries[dateKey] = {
          date: dateKey,
          totalWaterInML: 0,
          totalWaterInLiters: 0,
          totalWaterInGlasses: 0,
          entryCount: 0,
          dailyGoalML: 2500,
          progressPercentage: 0,
          isGoalReached: false,
          entries: [],
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Su kayıtlarını günlere göre grupla ve hesapla
      waterEntries.forEach((entry) => {
        const entryDate = new Date(entry.consumedAt);
        // Use local date formatting instead of UTC
        const year = entryDate.getFullYear();
        const month = String(entryDate.getMonth() + 1).padStart(2, '0');
        const day = String(entryDate.getDate()).padStart(2, '0');
        const entryDateKey = `${year}-${month}-${day}`;

        if (dailySummaries[entryDateKey]) {
          const summary = dailySummaries[entryDateKey];

          // Amount değerini manuel hesapla
          let amountInML = 0;
          if (entry.amount && entry.amount.value && entry.amount.unit) {
            switch (entry.amount.unit) {
              case 'ml':
                amountInML = entry.amount.value;
                break;
              case 'l':
                amountInML = entry.amount.value * 1000;
                break;
              case 'bardak':
                amountInML = entry.amount.value * 200;
                break;
              default:
                amountInML = 0;
            }
          }

          summary.totalWaterInML += amountInML;
          summary.totalWaterInLiters =
            Math.round((summary.totalWaterInML / 1000) * 100) / 100;
          summary.totalWaterInGlasses =
            Math.round((summary.totalWaterInML / 200) * 10) / 10;
          summary.entryCount += 1;
          summary.progressPercentage = Math.min(
            Math.round((summary.totalWaterInML / summary.dailyGoalML) * 100),
            100,
          );
          summary.isGoalReached = summary.totalWaterInML >= summary.dailyGoalML;
          summary.entries.push(entry);
        }
      });

      // Genel istatistikler
      const totalDays = Object.keys(dailySummaries).length;
      const daysWithEntries = Object.values(dailySummaries).filter(
        (day) => day.entryCount > 0,
      ).length;
      const daysGoalReached = Object.values(dailySummaries).filter(
        (day) => day.isGoalReached,
      ).length;
      const totalWaterInRange = Object.values(dailySummaries).reduce(
        (sum, day) => sum + day.totalWaterInML,
        0,
      );
      const averageDailyWater =
        totalDays > 0 ? Math.round(totalWaterInRange / totalDays) : 0;

      return {
        dateRange: {
          startDate: validatedDateRange.startDate,
          endDate: validatedDateRange.endDate,
          totalDays,
        },
        summary: {
          daysWithEntries,
          daysGoalReached,
          totalWaterInML: Math.round(totalWaterInRange),
          totalWaterInLiters:
            Math.round((totalWaterInRange / 1000) * 100) / 100,
          averageDailyWaterInML: averageDailyWater,
          averageDailyWaterInLiters:
            Math.round((averageDailyWater / 1000) * 100) / 100,
          goalCompletionRate:
            totalDays > 0 ? Math.round((daysGoalReached / totalDays) * 100) : 0,
        },
        dailySummaries: Object.values(dailySummaries).sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      };
    } catch (error) {
      console.error('Error getting water entries by date range:', error);
      if (error.name === 'ZodError') {
        throw createError(400, 'Geçersiz tarih aralığı', {
          issues: error.issues,
        });
      }
      if (error.statusCode === 400) throw error;
      throw createError(
        500,
        error.message ||
          'Tarih aralığı su kayıtları getirilirken bir hata oluştu.',
      );
    }
  }
}

// Singleton instance oluştur
const waterService = new WaterService();
export default waterService;
