import PDFDocument from 'pdfkit';
import Meal from '../models/Meal.js';
import https from 'https';
import http from 'http';
import { Buffer } from 'buffer';
import path from 'path';
import { createError } from 'h3';

// Türkçe karakterleri destekleyen bir font dosyası
// Font dosyasının projenizin root/assets/fonts/ altında olduğunu varsayalım.
const FONT_NAME = 'NotoSans'; // Font alias for PDFKit
const FONT_FILENAME = 'NotoSans-Regular.ttf'; // Actual filename
// Construct absolute path to the font file from the project root
const FONT_PATH = path.resolve(process.cwd(), 'assets', 'fonts', FONT_FILENAME);

class MealPDFService {
  async generateMealPDF(mealId, userLanguage = 'tr', event) {
    // Added event parameter
    try {
      // Get authenticated user from context
      const user = event.context.auth?.user;
      if (!user) {
        throw createError({
          statusCode: 401,
          message: 'Unauthorized',
        });
      }

      // Öğünü getir ve kullanıcının kendi öğünü olup olmadığını kontrol et
      const meal = await Meal.findOne({ _id: mealId, userId: user._id })
        .populate('foods.foodId')
        .select('+photoUrl'); // Ensure photoUrl is selected

      if (!meal) {
        // throw new Error('Öğün bulunamadı veya yetkiniz yok');
        throw createError({
          statusCode: 404,
          message: 'Öğün bulunamadı veya bu öğüne erişim yetkiniz yok.',
        });
      }

      // PDF belgesi oluştur - Türkçe karakter desteği için
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
        info: {
          Title: `${meal.name} - Öğün Raporu`,
          Subject: 'Beslenme Raporu',
          Keywords: 'beslenme, öğün, kalori, protein',
        },
      });

      // PDF buffer'ını toplamak için
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));

      // Fontu kaydet (Eğer font dosyası varsa)
      try {
        doc.registerFont(FONT_NAME, FONT_PATH);
        console.log(
          `[MealPDFService] Font registered: ${FONT_NAME} from ${FONT_PATH}`,
        );
      } catch (fontError) {
        console.warn(
          `[MealPDFService] Font yüklenemedi (${FONT_PATH}), varsayılan font kullanılacak:`,
          fontError.message,
        );
        // Font yüklenemezse, en azından hatayı loglayıp devam et
      }

      // Öğün resmi varsa ekle (başlıktan önce, daha küçük ve ortalı)
      console.log(
        '[MealPDFService] Checking for meal photo. URL:',
        meal.photoUrl,
      );
      if (meal.photoUrl) {
        try {
          const imageBuffer = await this.downloadImage(meal.photoUrl);
          console.log(
            '[MealPDFService] Image buffer downloaded. Length:',
            imageBuffer ? imageBuffer.length : 'null',
          );
          if (imageBuffer) {
            const imageWidth = 150;
            const maxImageHeight = 100;
            const imageX = (doc.page.width - imageWidth) / 2;
            let imageY = doc.y; // Current y before adding image

            // Check if image fits on current page, otherwise add new page
            if (
              imageY + maxImageHeight >
              doc.page.height - doc.page.margins.bottom
            ) {
              doc.addPage();
              imageY = doc.page.margins.top; // Reset Y to top of new page
            }

            doc.image(imageBuffer, imageX, imageY, {
              fit: [imageWidth, maxImageHeight],
              align: 'center',
            });
            // Manually update doc.y to be after the image
            doc.y = imageY + maxImageHeight;
            console.log('[MealPDFService] Image embedded into PDF.');
            doc.moveDown(1.5); // Space after image, before title
          }
        } catch (error) {
          console.error('[MealPDFService] Resim yükleme/ekleme hatası:', error);
          // Resim yüklenemezse devam et
        }
      }

      // Başlık - Türkçe karakter desteği için
      doc
        .font(FONT_NAME) // Kayıtlı fontu kullan
        .fontSize(20)
        .fillColor('#2D3748')
        .text(meal.name, { align: 'center' });

      doc.moveDown();

      // Tarih ve tip
      const mealTypes = {
        breakfast: 'Kahvaltı',
        lunch: 'Öğle Yemeği',
        dinner: 'Akşam Yemeği',
        snack: 'Atıştırmalık',
      };

      doc
        .font(FONT_NAME) // Kayıtlı fontu kullan
        .fontSize(12)
        .fillColor('#4A5568')
        .text(
          `Tarih: ${meal.date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
        )
        .text(`Öğün Tipi: ${mealTypes[meal.type] || meal.type}`);

      doc.moveDown();

      // Besinler tablosu başlığı
      doc
        .font(FONT_NAME) // Kayıtlı fontu kullan
        .fontSize(14)
        .fillColor('#2D3748')
        .text('Besinler:', { underline: true });

      doc.moveDown(0.5);

      // Tablo başlıkları
      const startX = 50;
      let currentY = doc.y;
      const foodNameColumnWidth = 150;
      const quantityColumnWidth = 60;
      const caloriesColumnWidth = 60;
      const proteinColumnWidth = 70;
      const carbsColumnWidth = 80;

      // Define column x positions
      const foodNameX = startX;
      const quantityX = foodNameX + foodNameColumnWidth;
      const caloriesX = quantityX + quantityColumnWidth;
      const proteinX = caloriesX + caloriesColumnWidth;
      const carbsX = proteinX + proteinColumnWidth;
      const tableEndX = carbsX + carbsColumnWidth;

      doc
        .font(FONT_NAME) // Kayıtlı fontu kullan
        .fontSize(10)
        .fillColor('#4A5568')
        .text('Besin Adı', foodNameX, currentY, { width: foodNameColumnWidth })
        .text('Miktar', quantityX, currentY, {
          width: quantityColumnWidth,
          align: 'right',
        })
        .text('Kalori', caloriesX, currentY, {
          width: caloriesColumnWidth,
          align: 'right',
        })
        .text('Protein (g)', proteinX, currentY, {
          width: proteinColumnWidth,
          align: 'right',
        })
        .text('Karbonhidrat (g)', carbsX, currentY, {
          width: carbsColumnWidth,
          align: 'right',
        });

      currentY += 20;

      // Çizgi
      doc
        .strokeColor('#E2E8F0')
        .moveTo(startX, currentY)
        .lineTo(tableEndX, currentY) // Corrected line to tableEndX
        .stroke();

      currentY += 10;

      // Besinleri listele
      doc.fillColor('#2D3748');
      // Font and size will be set inside the loop before height calculation and text rendering for this row

      for (const foodItem of meal.foods) {
        const food = foodItem.foodId;
        const quantity = foodItem.quantity.value;
        const multiplier = quantity / 100;

        // Besin değerlerini hesapla
        const calories = Math.round(
          (food.nutrients?.energy?.value || 0) * multiplier,
        );
        const protein =
          Math.round((food.nutrients?.protein?.value || 0) * multiplier * 10) /
          10;
        const carbohydrate =
          Math.round(
            (food.nutrients?.carbohydrate?.value || 0) * multiplier * 10,
          ) / 10;

        const foodName =
          food.name?.[userLanguage] ||
          food.name?.tr ||
          food.name ||
          'Bilinmeyen Besin';

        // Set font and size for consistent height calculation and rendering for this row
        doc.font(FONT_NAME).fontSize(9);

        const foodNameCellOptions = { width: foodNameColumnWidth };
        const foodNameHeight = doc.heightOfString(
          foodName,
          foodNameCellOptions,
        );
        const singleLineHeight = doc.currentLineHeight(); // Approx height for single line text

        const rowHeight = Math.max(singleLineHeight, foodNameHeight);

        // Render row content
        doc.text(foodName, foodNameX, currentY, foodNameCellOptions);
        doc.text(`${quantity} ${foodItem.quantity.unit}`, quantityX, currentY, {
          width: quantityColumnWidth,
          align: 'right',
        });
        doc.text(calories.toString(), caloriesX, currentY, {
          width: caloriesColumnWidth,
          align: 'right',
        });
        doc.text(protein.toString(), proteinX, currentY, {
          width: proteinColumnWidth,
          align: 'right',
        });
        doc.text(carbohydrate.toString(), carbsX, currentY, {
          width: carbsColumnWidth,
          align: 'right',
        });

        currentY += rowHeight + 5; // Add 5 points padding after the row

        // Sayfa sonu kontrolü
        if (currentY > 750) {
          doc.addPage();
          currentY = 50;
        }
      }

      doc.moveDown();

      // Toplam besin değerleri
      currentY = doc.y + 20;

      doc
        .strokeColor('#E2E8F0')
        .moveTo(startX, currentY)
        .lineTo(420, currentY)
        .stroke();

      currentY += 15;

      doc
        .font(FONT_NAME) // Kayıtlı fontu kullan
        .fontSize(12)
        .fillColor('#2D3748')
        .text('TOPLAM BESİN DEĞERLERİ:', startX, currentY);

      currentY += 20;

      doc
        .font(FONT_NAME) // Kayıtlı fontu kullan
        .fontSize(10)
        .fillColor('#4A5568')
        .text(
          `Toplam Kalori: ${Math.round(meal.totalNutrients.calories)} kcal`,
          startX,
          currentY,
        )
        .text(
          `Toplam Protein: ${Math.round(meal.totalNutrients.protein * 10) / 10} g`,
          startX,
          currentY + 15,
        )
        .text(
          `Toplam Karbonhidrat: ${Math.round(meal.totalNutrients.carbohydrate * 10) / 10} g`,
          startX,
          currentY + 30,
        )
        .text(
          `Toplam Yağ: ${Math.round(meal.totalNutrients.fat * 10) / 10} g`,
          startX,
          currentY + 45,
        );

      // Notlar varsa ekle
      if (meal.notes) {
        currentY += 80;
        doc
          .font(FONT_NAME) // Kayıtlı fontu kullan
          .fontSize(12)
          .fillColor('#2D3748')
          .text('Notlar:', startX, currentY);

        currentY += 20;
        doc
          .font(FONT_NAME) // Kayıtlı fontu kullan
          .fontSize(10)
          .fillColor('#4A5568')
          .text(meal.notes, startX, currentY, { width: 500 });
      }

      // Footer
      doc
        .font(FONT_NAME) // Kayıtlı fontu kullan
        .fontSize(8)
        .fillColor('#718096')
        .text(
          `ProjectNut - ${new Date().toLocaleDateString('tr-TR')}`,
          50,
          750,
          {
            align: 'center',
            width: 500,
          },
        );

      // PDF'i sonlandır
      doc.end();

      return new Promise((resolve, reject) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          resolve({
            buffer: pdfBuffer,
            filename: `${meal.name.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]/g, '_')}_${meal.date.toISOString().split('T')[0]}.pdf`,
            mimeType: 'application/pdf',
          });
        });

        doc.on('error', reject);
      });
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      // throw new Error('PDF oluşturulurken bir hata oluştu');
      throw createError({
        statusCode: 500,
        message: 'PDF oluşturulurken bir hata oluştu',
        cause: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  // Resim indirme metodu - S3 URL'leri için optimize edilmiş
  async downloadImage(imageUrl) {
    console.log(
      '[MealPDFService - downloadImage] Attempting to download image from:',
      imageUrl,
    );

    return new Promise((resolve, reject) => {
      // URL validation
      if (!imageUrl || typeof imageUrl !== 'string') {
        reject(new Error("Geçersiz resim URL'i"));
        return;
      }

      // Check if it's a valid HTTP/HTTPS URL
      let parsedUrl;
      try {
        parsedUrl = new URL(imageUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          reject(
            new Error(
              'Desteklenmeyen protokol. Sadece HTTP/HTTPS desteklenir.',
            ),
          );
          return;
        }
      } catch (error) {
        reject(new Error('Geçersiz URL formatı'));
        return;
      }

      const client = imageUrl.startsWith('https') ? https : http;

      const request = client.get(imageUrl, (response) => {
        console.log(
          '[MealPDFService - downloadImage] Response status code:',
          response.statusCode,
        );

        // Handle redirects
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          console.log(
            '[MealPDFService - downloadImage] Following redirect to:',
            response.headers.location,
          );
          // Recursively follow redirect (be careful of infinite loops)
          this.downloadImage(response.headers.location)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Resim indirilemedi. HTTP Durumu: ${response.statusCode}`,
            ),
          );
          return;
        }

        // Check content type
        const contentType = response.headers['content-type'];
        if (contentType && !contentType.startsWith('image/')) {
          reject(new Error('İndirilen dosya resim formatında değil'));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          try {
            const imageBuffer = Buffer.concat(chunks);
            console.log(
              '[MealPDFService - downloadImage] Image download complete. Buffer length:',
              imageBuffer.length,
            );

            // Validate minimum size
            if (imageBuffer.length < 100) {
              reject(
                new Error(
                  'İndirilen dosya çok küçük, geçerli bir resim değil gibi görünüyor.',
                ),
              );
              return;
            }

            // Basic image format validation (check magic bytes)
            const isValidImage = this.validateImageBuffer(imageBuffer);
            if (!isValidImage) {
              reject(
                new Error('İndirilen dosya geçerli bir resim formatında değil'),
              );
              return;
            }

            resolve(imageBuffer);
          } catch (e) {
            console.error(
              '[MealPDFService - downloadImage] Error processing image data:',
              e,
            );
            reject(new Error('Resim verisi işlenirken hata oluştu.'));
          }
        });
      });

      request.on('error', (err) => {
        console.error(
          '[MealPDFService - downloadImage] Image download request error:',
          err,
        );
        reject(new Error(`Resim indirme isteği hatası: ${err.message}`));
      });

      request.setTimeout(15000, () => {
        request.destroy();
        reject(new Error('Resim indirme zaman aşımı (15 saniye)'));
      });
    });
  }

  // Simple image format validation by checking magic bytes
  validateImageBuffer(buffer) {
    if (!buffer || buffer.length < 8) {
      return false;
    }

    // Check for common image format magic bytes
    const jpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const png =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;
    const gif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
    const webp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;

    return jpg || png || gif || webp;
  }
}

export default new MealPDFService();
