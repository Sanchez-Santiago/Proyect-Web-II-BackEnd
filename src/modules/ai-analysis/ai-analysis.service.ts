import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { VehicleAnalyticsModel } from '../../models/vehicle-analytics.model';
import { VehicleModel } from '../../models/vehicle.model';
import { CreateAiAnalysisInput } from './dto/create-ai-analysis.dto';
import { UpdateAiAnalysisInput } from './dto/update-ai-analysis.dto';

@Injectable()
export class AiAnalysisService {
  async create(input: CreateAiAnalysisInput) {
    const vehicle = await VehicleModel.findById(input.vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');

    const existing = await VehicleAnalyticsModel.findByVehicleId(input.vehicleId);
    if (existing) throw new BadRequestException('Ya existe un análisis para este vehículo');

    const data = input as any;
    return VehicleAnalyticsModel.create({
      vehicle: { connect: { id: input.vehicleId } },
      paintCondition: data.paintCondition,
      engineCondition: data.engineCondition,
      interiorCondition: data.interiorCondition,
      tiresCondition: data.tiresCondition,
      rimsCondition: data.rimsCondition,
      suspensionCondition: data.suspensionCondition,
      transmissionCondition: data.transmissionCondition,
      lightsCondition: data.lightsCondition,
      overallScore: data.overallScore ? Number(data.overallScore) : null,
      estimatedPrice: data.estimatedPrice ? Number(data.estimatedPrice) : null,
      damageDetected: data.damageReport,
      confidenceScore: data.confidence ? Number(data.confidence) : null,
      aiProvider: data.aiProvider || null,
    });
  }

  async findByVehicleId(vehicleId: string) {
    const analysis = await VehicleAnalyticsModel.findByVehicleId(vehicleId);
    if (!analysis) throw new NotFoundException('Análisis no encontrado');
    return analysis;
  }

  async update(id: string, input: UpdateAiAnalysisInput) {
    const existing = await VehicleAnalyticsModel.findById(id);
    if (!existing) throw new NotFoundException('Análisis no encontrado');

    const data = input as any;
    return VehicleAnalyticsModel.update(id, {
      paintCondition: data.paintCondition,
      engineCondition: data.engineCondition,
      interiorCondition: data.interiorCondition,
      tiresCondition: data.tiresCondition,
      rimsCondition: data.rimsCondition,
      suspensionCondition: data.suspensionCondition,
      transmissionCondition: data.transmissionCondition,
      lightsCondition: data.lightsCondition,
      overallScore: data.overallScore ? Number(data.overallScore) : undefined,
      estimatedPrice: data.estimatedPrice ? Number(data.estimatedPrice) : undefined,
      damageDetected: data.damageReport,
      confidenceScore: data.confidence ? Number(data.confidence) : undefined,
    });
  }

  async delete(id: string) {
    const existing = await VehicleAnalyticsModel.findById(id);
    if (!existing) throw new NotFoundException('Análisis no encontrado');

    await VehicleAnalyticsModel.delete(id);
    return { message: 'Análisis eliminado correctamente' };
  }
}