import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { promisify } from 'util';
import sharp from 'sharp';
import s3Utility from './s3Utility.js';

/**
 * Shared S3 Upload Utility for all file upload operations
 * Provides consistent configuration and methods for uploading/deleting files
 */
class UploadUtility {
  constructor() {
    // Use shared S3 utility
    this.s3Utility = s3Utility;
  }

  /**
   * Create multer middleware with custom configuration
   * @param {Object} options - Configuration options
   * @param {string} options.fieldName - Field name for single file upload
   * @param {Array} options.fields - Array of field configurations for multiple files
   * @param {number} options.fileSize - Maximum file size in bytes (default: 10MB)
   * @param {Function} options.fileFilter - Custom file filter function
   * @returns {Function} Promisified multer middleware
   */
  createMulterMiddleware(options = {}) {
    const {
      fieldName,
      fields,
      fileSize = 10 * 1024 * 1024, // 10MB default
      fileFilter = this.defaultImageFilter,
    } = options;

    const storage = multer.memoryStorage();
    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize },
    });

    // Return appropriate middleware based on configuration
    if (fields) {
      return promisify(upload.fields(fields));
    } else if (fieldName) {
      return promisify(upload.single(fieldName));
    } else {
      throw new Error('Either fieldName or fields must be provided');
    }
  }

  /**
   * Default file filter for image files
   */
  defaultImageFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir'), false);
    }
  }

  /**
   * Optimize image using Sharp
   * @param {Buffer} buffer - Original image buffer
   * @param {Object} options - Optimization options
   * @returns {Promise<Buffer>} Optimized image buffer
   */
  async optimizeImage(buffer, options = {}) {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'jpeg',
    } = options;

    try {
      console.log('Orijinal dosya boyutu:', buffer.length, 'bytes');

      let sharpInstance = sharp(buffer).resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });

      // Apply format-specific optimizations
      if (format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({
          quality,
          progressive: true,
        });
      } else if (format === 'png') {
        sharpInstance = sharpInstance.png({
          quality,
          progressive: true,
        });
      } else if (format === 'webp') {
        sharpInstance = sharpInstance.webp({
          quality,
        });
      }

      const optimizedBuffer = await sharpInstance.toBuffer();

      console.log(
        'Optimize edilmiş dosya boyutu:',
        optimizedBuffer.length,
        'bytes',
      );
      console.log(
        'Boyut azalması:',
        (
          ((buffer.length - optimizedBuffer.length) / buffer.length) *
          100
        ).toFixed(2) + '%',
      );

      return optimizedBuffer;
    } catch (error) {
      console.error('Sharp optimizasyon hatası:', error);
      // Return original buffer if optimization fails
      return buffer;
    }
  }

  /**
   * Generate S3 file URL
   * @param {string} fileName - File name/key in S3
   * @returns {string} Full S3 URL
   */
  generateS3Url(fileName) {
    return this.s3Utility.generateS3Url(fileName);
  }

  /**
   * Upload file to S3
   * @param {Buffer} fileBuffer - File buffer to upload
   * @param {string} fileName - File name/key for S3
   * @param {string} contentType - MIME type of the file
   * @param {string} folder - Optional folder prefix
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  async uploadToS3(fileBuffer, fileName, contentType, folder = '') {
    return await this.s3Utility.uploadFile(fileBuffer, {
      fileName,
      folder,
      contentType,
    });
  }

  /**
   * Delete file from S3
   * @param {string} fileUrl - Complete S3 URL or just the key
   * @returns {Promise<Object>} Deletion result
   */
  async deleteFromS3(fileUrl) {
    return await this.s3Utility.deleteFile(fileUrl);
  }

  /**
   * Upload and optimize image in one operation
   * @param {Buffer} imageBuffer - Original image buffer
   * @param {Object} options - Upload and optimization options
   * @returns {Promise<Object>} Upload result with optimization stats
   */
  async uploadOptimizedImage(imageBuffer, options = {}) {
    const {
      folder = '',
      fileName,
      optimization = {},
      format = 'jpeg',
    } = options;

    try {
      // Generate filename if not provided
      const finalFileName =
        fileName || `${randomUUID()}.${format === 'jpeg' ? 'jpg' : format}`;

      // Optimize image
      const optimizedBuffer = await this.optimizeImage(imageBuffer, {
        format,
        ...optimization,
      });

      // Upload to S3 using S3 utility
      const uploadResult = await this.s3Utility.uploadFile(optimizedBuffer, {
        fileName: finalFileName,
        folder,
        contentType: `image/${format}`,
      });

      return {
        ...uploadResult,
        originalSize: imageBuffer.length,
        optimizedSize: optimizedBuffer.length,
        compressionRatio: (
          ((imageBuffer.length - optimizedBuffer.length) / imageBuffer.length) *
          100
        ).toFixed(2),
      };
    } catch (error) {
      console.error('Optimized image upload failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new UploadUtility();
