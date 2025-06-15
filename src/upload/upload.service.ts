import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    // File is already saved by multer, just return the URL
    return `/uploads/${file.filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = join(process.cwd(), 'uploads', filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error - file might already be deleted
    }
  }

  validateImageFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 