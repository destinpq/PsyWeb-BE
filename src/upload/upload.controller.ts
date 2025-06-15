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
import { UploadService } from './upload.service';
import { join } from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.uploadService.validateImageFile(file)) {
      throw new BadRequestException('Only image files are allowed');
    }

    const url = await this.uploadService.saveFile(file);

    return {
      message: 'File uploaded successfully',
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: this.uploadService.formatFileSize(file.size),
      mimetype: file.mimetype,
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