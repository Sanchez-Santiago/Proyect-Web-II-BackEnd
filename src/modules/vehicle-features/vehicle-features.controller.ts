import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { VehicleFeaturesService } from './vehicle-features.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('vehicle-features')
export class VehicleFeaturesController {
  constructor(private vehicleFeaturesService: VehicleFeaturesService) {}

  @Get()
  async findAll() {
    const features = await this.vehicleFeaturesService.findAll();
    return { features };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const feature = await this.vehicleFeaturesService.findById(id);
    return { feature };
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() body: { featureName: string }) {
    const feature = await this.vehicleFeaturesService.create(body);
    return { message: 'Característica creada', feature };
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    const result = await this.vehicleFeaturesService.delete(id);
    return result;
  }
}