import { Response } from 'express';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File): Promise<{
        message: string;
        url: string;
        filename: string;
        originalName: string;
        size: string;
        mimetype: string;
    }>;
    getFile(filename: string, res: Response): Promise<void>;
}
