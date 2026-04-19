import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgjtuizmg',
      api_key: process.env.CLOUDINARY_API_KEY || '217313813894761',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'yrM31uLguSRLLOvK6N0hGBQpNoM',
    });
  }

  async uploadImage(file: string, folder: string = 'vehicles'): Promise<string> {
    const result = await cloudinary.uploader.upload(file, {
      folder,
    });
    return result.secure_url;
  }

  async uploadFromBuffer(buffer: Buffer, filename: string, folder: string = 'vehicles'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || '');
        }
      );
      uploadStream.end(buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}