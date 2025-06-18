import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface UploadResponse {
  message: string;
  url: string;
  filename: string;
  originalName: string;
  size: string;
  mimetype: string;
  fileType: 'image' | 'video' | 'pdf';
}

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
      'image/svg+xml',
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  validateVideoFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mov',
      'video/wmv',
      'video/flv',
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  validatePdfFile(file: Express.Multer.File): boolean {
    return file.mimetype === 'application/pdf';
  }

  validateMediaFile(file: Express.Multer.File): { isValid: boolean; fileType: 'image' | 'video' | 'pdf' | null } {
    if (this.validateImageFile(file)) {
      return { isValid: true, fileType: 'image' };
    }
    if (this.validateVideoFile(file)) {
      return { isValid: true, fileType: 'video' };
    }
    if (this.validatePdfFile(file)) {
      return { isValid: true, fileType: 'pdf' };
    }
    return { isValid: false, fileType: null };
  }

  getFileType(mimetype: string): 'image' | 'video' | 'pdf' | 'unknown' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype === 'application/pdf') return 'pdf';
    return 'unknown';
  }

  getMaxFileSize(fileType: 'image' | 'video' | 'pdf'): number {
    switch (fileType) {
      case 'image':
        return 10 * 1024 * 1024; // 10MB for images
      case 'video':
        return 100 * 1024 * 1024; // 100MB for videos
      case 'pdf':
        return 20 * 1024 * 1024; // 20MB for PDFs
      default:
        return 5 * 1024 * 1024; // 5MB default
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateMarkdown(file: Express.Multer.File, url: string): string {
    const fileType = this.getFileType(file.mimetype);
    
    switch (fileType) {
      case 'image':
        return `![${file.originalname}](${url})`;
      case 'video':
        return `<video controls width="100%" style="max-width: 800px;">
  <source src="${url}" type="${file.mimetype}">
  Your browser does not support the video tag.
</video>

*Video: ${file.originalname}*`;
      case 'pdf':
        return `[📄 ${file.originalname}](${url})

*PDF Document - Click to view*`;
      default:
        return `[${file.originalname}](${url})`;
    }
  }
} 