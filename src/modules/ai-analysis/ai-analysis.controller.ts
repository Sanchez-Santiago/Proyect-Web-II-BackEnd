import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { CreateAiAnalysisDto, UpdateAiAnalysisDto, CreateAiAnalysisInput, UpdateAiAnalysisInput } from './dto/ai-analysis.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai-analysis')
@UseGuards(JwtAuthGuard)
export class AiAnalysisController {
  constructor(private aiAnalysisService: AiAnalysisService) {}

  @Post()
  async create(@Body() dto: CreateAiAnalysisInput) {
    const analysis = await this.aiAnalysisService.create(dto);
    return { message: 'Análisis creado exitosamente', analysis };
  }

  @Get('vehicle/:vehicleId')
  async findByVehicleId(@Param('vehicleId') vehicleId: string) {
    const analysis = await this.aiAnalysisService.findByVehicleId(vehicleId);
    return { analysis };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAiAnalysisInput) {
    const analysis = await this.aiAnalysisService.update(id, dto);
    return { message: 'Análisis actualizado', analysis };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.aiAnalysisService.delete(id);
    return result;
  }
}