// server/api/foods/uploadPhoto.post.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { promisify } from 'util';

// S3 istemcisini yapılandır
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1', // Varsayılan bölge
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer yapılandırması
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = promisify(upload.single('photo'));

export default defineEventHandler(async (event) => {
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

    // Dosya adını oluştur
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `foods/${randomUUID()}.${fileExtension}`;
    const bucketName = process.env.AWS_BUCKET_NAME || 'nutpbucket';

    // S3'e yükleme komutu
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL kaldırıldı - bucket ACL'lere izin vermiyor
    });

    // S3'e yükle
    await s3Client.send(putCommand);

    // Dosya URL'sini oluştur
    const region = process.env.AWS_REGION || 'eu-central-1';
    
    // AWS S3 için doğru URL formatını kullan
    // eu-north-1 bölgesi için özel format
    let fileUrl;
    if (region === 'eu-north-1') {
      // Stockholm bölgesi için doğru format
      fileUrl = `https://s3.eu-north-1.amazonaws.com/${bucketName}/${fileName}`;
    } else {
      fileUrl = `https://s3.${region}.amazonaws.com/${bucketName}/${fileName}`;
    }
    
    console.log('Yüklenen dosya URL:', fileUrl);
    console.log('Bucket:', bucketName, 'Region:', region, 'FileName:', fileName);

    return {
      url: fileUrl
    };
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    return {
      statusCode: 500,
      error: 'Fotoğraf yüklenirken bir hata oluştu'
    };
  }
});