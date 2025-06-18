import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService, UploadResponse } from './upload.service';
import { join } from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.uploadService.validateImageFile(file)) {
      throw new BadRequestException('Only image files are allowed');
    }

    const url = await this.uploadService.saveFile(file);

    return {
      message: 'Image uploaded successfully',
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: this.uploadService.formatFileSize(file.size),
      mimetype: file.mimetype,
      fileType: 'image',
    };
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.uploadService.validateVideoFile(file)) {
      throw new BadRequestException('Only video files are allowed');
    }

    const maxSize = this.uploadService.getMaxFileSize('video');
    if (file.size > maxSize) {
      throw new BadRequestException(`Video file size must be less than ${this.uploadService.formatFileSize(maxSize)}`);
    }

    const url = await this.uploadService.saveFile(file);

    return {
      message: 'Video uploaded successfully',
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: this.uploadService.formatFileSize(file.size),
      mimetype: file.mimetype,
      fileType: 'video',
    };
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadPdf(@UploadedFile() file: Express.Multer.File): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.uploadService.validatePdfFile(file)) {
      throw new BadRequestException('Only PDF files are allowed');
    }

    const maxSize = this.uploadService.getMaxFileSize('pdf');
    if (file.size > maxSize) {
      throw new BadRequestException(`PDF file size must be less than ${this.uploadService.formatFileSize(maxSize)}`);
    }

    const url = await this.uploadService.saveFile(file);

    return {
      message: 'PDF uploaded successfully',
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: this.uploadService.formatFileSize(file.size),
      mimetype: file.mimetype,
      fileType: 'pdf',
    };
  }

  @Post('media')
  @UseInterceptors(FileInterceptor('media'))
  async uploadMedia(@UploadedFile() file: Express.Multer.File): Promise<UploadResponse & { markdown: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const validation = this.uploadService.validateMediaFile(file);
    if (!validation.isValid) {
      throw new BadRequestException('Only image, video, or PDF files are allowed');
    }

    const maxSize = this.uploadService.getMaxFileSize(validation.fileType!);
    if (file.size > maxSize) {
      throw new BadRequestException(`File size must be less than ${this.uploadService.formatFileSize(maxSize)}`);
    }

    const url = await this.uploadService.saveFile(file);
    const markdown = this.uploadService.generateMarkdown(file, url);

    return {
      message: `${validation.fileType!.charAt(0).toUpperCase() + validation.fileType!.slice(1)} uploaded successfully`,
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: this.uploadService.formatFileSize(file.size),
      mimetype: file.mimetype,
      fileType: validation.fileType!,
      markdown,
    };
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = join(process.cwd(), 'uploads', filename);
      return res.sendFile(filePath);
    } catch (error) {
      throw new BadRequestException('File not found');
    }
  }
} 