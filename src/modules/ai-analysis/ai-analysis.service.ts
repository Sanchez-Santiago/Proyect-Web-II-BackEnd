import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AiAnalysisModel, VehicleModel } from '../../model/prisma.model';
import { CreateAiAnalysisInput, UpdateAiAnalysisInput } from './dto/ai-analysis.dto';

@Injectable()
export class AiAnalysisService {
  async create(input: CreateAiAnalysisInput) {
    const vehicle = await VehicleModel.findById(input.vehicleId);
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');

    const existing = await AiAnalysisModel.findByVehicleId(input.vehicleId);
    if (existing) throw new BadRequestException('Ya existe un análisis para este vehículo');

    return AiAnalysisModel.create(input);
  }

  async findByVehicleId(vehicleId: string) {
    const analysis = await AiAnalysisModel.findByVehicleId(vehicleId);
    if (!analysis) throw new NotFoundException('Análisis no encontrado');
    return analysis;
  }

  async update(id: string, input: UpdateAiAnalysisInput) {
    const existing = await AiAnalysisModel.findById(id);
    if (!existing) throw new NotFoundException('Análisis no encontrado');

    return AiAnalysisModel.update(id, input);
  }

  async delete(id: string) {
    const existing = await AiAnalysisModel.findById(id);
    if (!existing) throw new NotFoundException('Análisis no encontrado');

    await AiAnalysisModel.delete(id);
    return { message: 'Análisis eliminado correctamente' };
  }
}