import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadsService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'plants');
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  async uploadPlantPhoto(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    // Validate file
    this.validateFile(file);

    // Ensure upload directory exists
    await this.ensureUploadDir();

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${userId}_${randomUUID()}.${fileExtension}`;
    const filepath = join(this.uploadDir, filename);

    // Save file
    await writeFile(filepath, file.buffer);

    // Return URL path (relative to serve static)
    return `/uploads/plants/${filename}`;
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  private async ensureUploadDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }
}
