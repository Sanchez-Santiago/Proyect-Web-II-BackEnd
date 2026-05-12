import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { VehicleModel } from '../../models/vehicle.model';
import { VehicleImageModel } from '../../models/vehicle-image.model';
import { CreateVehicleInput } from './dto/create-vehicle.dto';
import { UpdateVehicleInput } from './dto/update-vehicle.dto';
import { VehicleFiltersInput } from './dto/vehicle-filters.dto';

@Injectable()
export class VehiclesService {
  async create(sellerId: string, input: CreateVehicleInput) {
    const { images, ...vehicleData } = input;

    const vehicle = await VehicleModel.create({
      seller: { connect: { id: sellerId } },
      model: vehicleData.model,
      brand: vehicleData.brand,
      year: vehicleData.year,
      vehicleType: vehicleData.vehicleType,
      fuelType: vehicleData.fuelType || 'GASOLINE',
      transmission: vehicleData.transmission || 'MANUAL',
      color: vehicleData.color,
      mileage: vehicleData.mileage || 0,
      accidents: vehicleData.accidents,
      version: vehicleData.version,
      doors: vehicleData.doors,
      engine: vehicleData.engine,
      ownersCount: vehicleData.ownersCount || 1,
      vin: vehicleData.vin,
      licensePlate: vehicleData.licensePlate,
      hasDebt: vehicleData.hasDebt || false,
      debtAmount: vehicleData.debtAmount || 0,
    });

    if (images && images.length > 0) {
      await VehicleImageModel.createMany(
        images.map((img) => ({
          vehicleId: vehicle.id,
          imageUrl: img.url,
          imageName: img.title || null,
        })),
      );
    }

    return this.findById(vehicle.id);
  }

  async findById(id: string) {
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    return vehicle;
  }

  async findAll(filters: VehicleFiltersInput) {
    const processedFilters: any = { ...filters };

    if (filters.createdAtFrom) processedFilters.createdAtFrom = new Date(filters.createdAtFrom);
    if (filters.createdAtTo) processedFilters.createdAtTo = new Date(filters.createdAtTo);

    return VehicleModel.findAll(processedFilters);
  }

  async update(id: string, input: UpdateVehicleInput) {
    const existing = await VehicleModel.findById(id);
    if (!existing) throw new NotFoundException('Vehículo no encontrado');

    const { images, ...vehicleData } = input as any;

    await VehicleModel.update(id, {
      model: vehicleData.model,
      brand: vehicleData.brand,
      year: vehicleData.year,
      vehicleType: vehicleData.vehicleType,
      fuelType: vehicleData.fuelType,
      transmission: vehicleData.transmission,
      color: vehicleData.color,
      mileage: vehicleData.mileage,
      accidents: vehicleData.accidents,
      version: vehicleData.version,
      doors: vehicleData.doors,
      engine: vehicleData.engine,
      ownersCount: vehicleData.ownersCount,
      vin: vehicleData.vin,
      licensePlate: vehicleData.licensePlate,
      hasDebt: vehicleData.hasDebt,
      debtAmount: vehicleData.debtAmount,
    });

    if (images) {
      await VehicleImageModel.deleteByVehicleId(id);
      if (images.length > 0) {
        await VehicleImageModel.createMany(
          images.map((img) => ({
            vehicleId: id,
            imageUrl: img.url,
            imageName: img.title || null,
          })),
        );
      }
    }

    return this.findById(id);
  }

  async delete(id: string) {
    const existing = await VehicleModel.findById(id);
    if (!existing) throw new NotFoundException('Vehículo no encontrado');

    await VehicleModel.delete(id);
    return { message: 'Vehículo eliminado correctamente' };
  }

  async addImage(sellerId: string, vehicleId: string, url: string, title?: string) {
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    
    if (vehicle.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de este vehículo');
    }

    const image = await VehicleImageModel.create({
      vehicle: { connect: { id: vehicleId } },
      imageUrl: url,
      imageName: title || null,
    });

    return image;
  }

  async addImagesBulk(sellerId: string, vehicleId: string, images: { url: string; title?: string }[]) {
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    
    if (vehicle.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de este vehículo');
    }

    const result = await VehicleImageModel.createMany(
      images.map((img) => ({
        vehicleId,
        imageUrl: img.url,
        imageName: img.title || null,
      })),
    );

    return { count: result.count };
  }

  async getImages(vehicleId: string) {
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');

    return VehicleImageModel.findByVehicleId(vehicleId);
  }

  async deleteImage(sellerId: string, imageId: string, vehicleId: string) {
    const image = await VehicleImageModel.findById(imageId);
    if (!image) throw new NotFoundException('Imagen no encontrada');
    
    if (image.vehicleId !== vehicleId) {
      throw new NotFoundException('Imagen no pertenece a este vehículo');
    }
    
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    
    if (vehicle.sellerId !== sellerId) {
      throw new ForbiddenException('No eres el propietario de este vehículo');
    }

    await VehicleImageModel.delete(imageId);
    return { message: 'Imagen eliminada correctamente' };
  }
}