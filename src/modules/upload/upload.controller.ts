import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  async uploadImage(@Body() body: { imageUrl: string; vehicleId?: string }) {
    const result = await this.uploadService.uploadFromUrl(body.imageUrl, body.vehicleId);
    return { message: 'Imagen subida exitosamente', url: result };
  }
}