import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

/**
 * AWS S3 Management Utility
 * Provides consistent S3 operations for file uploads and deletions
 */
class S3Utility {
  constructor() {
    // S3 Client Configuration
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'eu-central-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = process.env.AWS_BUCKET_NAME || 'nutpbucket';
    this.region = process.env.AWS_REGION || 'eu-central-1';
  }

  /**
   * Generate S3 file URL based on region
   * @param {string} s3Key - File key in S3 (e.g., "folder/filename.jpg")
   * @returns {string} Full S3 URL
   */
  generateS3Url(s3Key) {
    // Handle different region URL formats (currently path-style)
    // Example: https://s3.eu-central-1.amazonaws.com/nutpbucket/meals/image.jpg
    if (this.region === 'eu-north-1') {
      // Specific handling if ever needed
      return `https://s3.eu-north-1.amazonaws.com/${this.bucketName}/${s3Key}`;
    } else {
      return `https://s3.${this.region}.amazonaws.com/${this.bucketName}/${s3Key}`;
    }
  }

  /**
   * Upload file buffer to S3
   * @param {Buffer} fileBuffer - File buffer to upload
   * @param {Object} options - Upload options
   * @param {string} options.fileName - Custom file name (optional, will generate UUID if not provided)
   * @param {string} options.folder - Folder prefix (optional)
   * @param {string} options.contentType - MIME type of the file
   * @param {string} options.fileExtension - File extension (required if fileName not provided)
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  async uploadFile(fileBuffer, options = {}) {
    try {
      const { fileName, folder = '', contentType, fileExtension } = options;

      let finalFileName;
      if (fileName) {
        finalFileName = fileName;
      } else if (fileExtension) {
        finalFileName = `${randomUUID()}.${fileExtension}`;
      } else {
        throw new Error('Either fileName or fileExtension must be provided');
      }

      const s3Key = folder ? `${folder}/${finalFileName}` : finalFileName;

      const putCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await this.s3Client.send(putCommand);
      const fileUrl = this.generateS3Url(s3Key);

      console.log("[S3Utility] Dosya S3'e başarıyla yüklendi:", fileUrl);

      return {
        success: true,
        url: fileUrl,
        key: s3Key,
        fileName: finalFileName,
        bucket: this.bucketName,
        size: fileBuffer.length,
      };
    } catch (error) {
      console.error('[S3Utility] S3 yükleme hatası:', error);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Extract S3 key from full S3 URL (path-style)
   * @param {string} fileUrl - Full S3 URL (e.g., https://s3.region.amazonaws.com/bucket/folder/key.jpg)
   * @returns {string|null} S3 key (e.g., folder/key.jpg) or null if invalid URL or format
   */
  extractKeyFromUrl(fileUrl) {
    try {
      if (!fileUrl || !fileUrl.startsWith('http')) {
        console.warn(
          '[S3Utility] Invalid file URL for key extraction (not starting with http):',
          fileUrl,
        );
        return null;
      }

      const url = new URL(fileUrl);
      const expectedPathPrefix = `/${this.bucketName}/`;

      if (url.pathname.startsWith(expectedPathPrefix)) {
        const key = url.pathname.substring(expectedPathPrefix.length);
        if (key) {
          // Ensure the key is not empty
          return key;
        } else {
          console.warn(
            `[S3Utility] Extracted empty key from URL: ${fileUrl} with pathname ${url.pathname}`,
          );
          return null;
        }
      } else {
        console.warn(
          `[S3Utility] URL pathname "${url.pathname}" for URL "${fileUrl}" does not match expected format "${expectedPathPrefix}<key>". Attempting fallback extraction.`,
        );
        // Fallback: if pathname starts with '/', take the rest as key.
        // This might be useful for virtual-hosted style URLs if they are ever passed,
        // where pathname is just /key or /folder/key
        if (url.pathname.length > 1 && url.pathname.startsWith('/')) {
          const potentialKey = url.pathname.substring(1);
          console.log(
            `[S3Utility] Fallback extracted key: "${potentialKey}" from "${fileUrl}"`,
          );
          return potentialKey;
        }
        console.error(
          '[S3Utility] Fallback key extraction failed for URL:',
          fileUrl,
        );
        return null;
      }
    } catch (error) {
      console.error(
        '[S3Utility] Error parsing URL for key extraction:',
        fileUrl,
        error,
      );
      return null;
    }
  }

  /**
   * Delete file from S3
   * @param {string} fileUrlOrKey - Complete S3 URL or S3 key
   * @returns {Promise<Object>} Deletion result
   */
  async deleteFile(fileUrlOrKey) {
    let s3Key = null; // Initialize s3Key to null for robust error logging
    try {
      if (!fileUrlOrKey) {
        throw new Error('File URL or key is required for deletion');
      }

      if (fileUrlOrKey.startsWith('http')) {
        s3Key = this.extractKeyFromUrl(fileUrlOrKey);
        if (!s3Key) {
          console.error(
            `[S3Utility] Failed to extract S3 key from URL: "${fileUrlOrKey}". Extracted key was null or empty. Deletion aborted.`,
          );
          throw new Error(
            `Failed to extract a valid S3 key from URL: "${fileUrlOrKey}". Deletion cannot proceed.`,
          );
        }
      } else {
        s3Key = fileUrlOrKey; // Assume it's already a key
      }

      console.log(
        `[S3Utility] Attempting to delete S3 object. Bucket: ${this.bucketName}, Key: "${s3Key}"`,
      );

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      await this.s3Client.send(deleteCommand);

      console.log(
        `[S3Utility] Successfully deleted S3 object: Key: "${s3Key}" from bucket "${this.bucketName}"`,
      );

      return {
        success: true,
        message: 'File deleted successfully from S3',
        key: s3Key,
      };
    } catch (error) {
      const errorMessageContext = s3Key
        ? `key "${s3Key}" (from "${fileUrlOrKey}")`
        : `input "${fileUrlOrKey}"`;
      console.error(
        `[S3Utility] S3 deletion error for ${errorMessageContext}:`,
        error,
      );

      if (
        error.name === 'NoSuchKey' ||
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        console.warn(
          `[S3Utility] Attempted to delete non-existent ${errorMessageContext}. Considering deletion successful as file is not present.`,
        );
        return {
          success: true,
          message: 'File not found on S3 or already deleted.',
          key: s3Key, // s3Key might be null if extraction failed before this point but error was NoSuchKey
        };
      }
      throw new Error(
        `S3 deletion failed for ${errorMessageContext}: ${error.message}`,
      );
    }
  }

  /**
   * Check if file exists in S3
   * @param {string} fileUrlOrKey - S3 URL or key
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(fileUrlOrKey) {
    let s3Key = null;
    try {
      if (fileUrlOrKey.startsWith('http')) {
        s3Key = this.extractKeyFromUrl(fileUrlOrKey);
        if (!s3Key) {
          console.warn(
            `[S3Utility] Could not extract key from URL for fileExists check: ${fileUrlOrKey}. Assuming file does not exist.`,
          );
          return false;
        }
      } else {
        s3Key = fileUrlOrKey;
      }

      if (!s3Key) {
        // Double check s3Key is not null/empty before proceeding
        console.warn(
          '[S3Utility] fileExists check aborted due to empty or null S3 key from input:',
          fileUrlOrKey,
        );
        return false;
      }

      const headCommand = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      await this.s3Client.send(headCommand);
      return true;
    } catch (error) {
      const errorMessageContext = s3Key
        ? `key "${s3Key}" (from "${fileUrlOrKey}")`
        : `input "${fileUrlOrKey}"`;
      if (
        error.name === 'NotFound' ||
        error.name === 'NoSuchKey' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      console.error(
        `[S3Utility] Error checking file existence for ${errorMessageContext}:`,
        error,
      );
      throw error; // Re-throw other errors
    }
  }
}

export default new S3Utility();
