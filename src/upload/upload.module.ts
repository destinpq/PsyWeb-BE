import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allow images, videos, and PDFs
        const allowedMimeTypes = [
          // Images
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          // Videos
          'video/mp4',
          'video/webm',
          'video/ogg',
          'video/avi',
          'video/mov',
          'video/wmv',
          'video/flv',
          // PDFs
          'application/pdf',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Only image, video, and PDF files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB maximum (for videos)
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {} 