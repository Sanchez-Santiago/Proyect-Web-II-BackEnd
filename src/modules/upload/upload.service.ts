import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly isCloudinaryConfigured: boolean;

  constructor() {
    this.isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
    );

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFromUrl(imageUrl: string, vehicleId?: string): Promise<string> {
    if (!this.isCloudinaryConfigured) {
      return imageUrl;
    }

    const folder = vehicleId ? `vehicles/${vehicleId}` : 'vehicles';
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      resource_type: 'image',
    });

    return result.secure_url;
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
