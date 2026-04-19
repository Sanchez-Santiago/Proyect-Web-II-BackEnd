import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleModel, VehicleImageModel } from '../../model/prisma.model';
import { CreateVehicleInput } from './dto/create-vehicle.dto';
import { UpdateVehicleInput } from './dto/update-vehicle.dto';
import { VehicleFiltersInput } from './dto/vehicle-filters.dto';

@Injectable()
export class VehiclesService {
  async create(sellerId: string, input: CreateVehicleInput) {
    const { images, ...vehicleData } = input;

    const vehicle = await VehicleModel.create({
      sellerId,
      ...vehicleData,
      lastServiceDate: input.lastServiceDate ? new Date(input.lastServiceDate) : undefined,
      lastOilChange: input.lastOilChange ? new Date(input.lastOilChange) : undefined,
    });

    if (images && images.length > 0) {
      await VehicleImageModel.createMany(
        images.map((img) => ({
          vehicleId: vehicle.id,
          url: img.url,
          title: img.title,
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

    const { images, ...vehicleData } = input;

    await VehicleModel.update(id, {
      ...vehicleData,
      lastServiceDate: input.lastServiceDate ? new Date(input.lastServiceDate) : undefined,
      lastOilChange: input.lastOilChange ? new Date(input.lastOilChange) : undefined,
    });

    if (images) {
      await VehicleImageModel.deleteByVehicleId(id);
      if (images.length > 0) {
        await VehicleImageModel.createMany(
          images.map((img) => ({
            vehicleId: id,
            url: img.url,
            title: img.title,
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
}