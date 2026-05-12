import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleModel, VehicleImageModel } from '../../model/prisma.model';
import { CreateVehicleInput, UpdateVehicleInput, VehicleFiltersInput } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  async create(sellerId: string, input: CreateVehicleInput) {
    const { images, analyticState, ...vehicleData } = input;

    const vehicle = await VehicleModel.create({
      ...vehicleData,
      analyticState: analyticState ? { create: analyticState } : undefined,
    });

    if (images && images.length > 0) {
      await VehicleImageModel.createMany(
        images.map((img) => ({
          vehicleId: vehicle.id,
          url: img.url,
          name: img.name,
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

    return VehicleModel.findAll(processedFilters);
  }

  async update(id: string, input: UpdateVehicleInput) {
    const existing = await VehicleModel.findById(id);
    if (!existing) throw new NotFoundException('Vehículo no encontrado');

    const { images, analyticState, ...vehicleData } = input;

    await VehicleModel.update(id, {
      ...vehicleData,
      analyticState: analyticState
        ? {
            upsert: {
              create: analyticState,
              update: analyticState,
            },
          }
        : undefined,
    });

    if (images) {
      await VehicleImageModel.deleteByVehicleId(id);
      if (images.length > 0) {
        await VehicleImageModel.createMany(
          images.map((img) => ({
            vehicleId: id,
            url: img.url,
            name: img.name,
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
