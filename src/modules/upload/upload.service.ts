import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgjtuizmg',
      api_key: process.env.CLOUDINARY_API_KEY || '217313813894761',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'yrM31uLguSRLLOvK6N0hGBQpNoM',
    });
  }

  async uploadFromUrl(imageUrl: string, vehicleId?: string): Promise<string> {
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