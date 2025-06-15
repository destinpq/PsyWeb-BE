export declare class UploadService {
    saveFile(file: Express.Multer.File): Promise<string>;
    deleteFile(filename: string): Promise<void>;
    validateImageFile(file: Express.Multer.File): boolean;
    formatFileSize(bytes: number): string;
}
