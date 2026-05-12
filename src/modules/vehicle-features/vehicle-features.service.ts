import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { VehicleFeatureModel } from '../../models/vehicle-feature.model';

@Injectable()
export class VehicleFeaturesService {
  async create(data: { featureName: string }) {
    const existing = await VehicleFeatureModel.findByName(data.featureName);
    if (existing) throw new BadRequestException('La característica ya existe');
    return VehicleFeatureModel.create(data);
  }

  async findAll() {
    return VehicleFeatureModel.findAll();
  }

  async findById(id: string) {
    const feature = await VehicleFeatureModel.findById(id);
    if (!feature) throw new NotFoundException('Característica no encontrada');
    return feature;
  }

  async delete(id: string) {
    const feature = await VehicleFeatureModel.findById(id);
    if (!feature) throw new NotFoundException('Característica no encontrada');
    return VehicleFeatureModel.delete(id);
  }
}