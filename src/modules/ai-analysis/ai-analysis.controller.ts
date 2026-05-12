import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { CreateAiAnalysisInput } from './dto/create-ai-analysis.dto';
import { UpdateAiAnalysisInput } from './dto/update-ai-analysis.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('ai-analysis')
@UseGuards(JwtGuard)
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