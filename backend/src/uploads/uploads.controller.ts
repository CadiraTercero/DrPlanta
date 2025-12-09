import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('plant-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPlantPhoto(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = await this.uploadsService.uploadPlantPhoto(file, userId);

    return { url };
  }
}
