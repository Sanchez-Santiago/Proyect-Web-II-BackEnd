import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto, VehicleFiltersDto, CreateVehicleInput, UpdateVehicleInput, VehicleFiltersInput } from './dto/vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: any, @Body() dto: CreateVehicleInput) {
    const vehicle = await this.vehiclesService.create(req.user.userId, dto);
    return { message: 'Vehículo creado exitosamente', vehicle };
  }

  @Get('filters')
  async findAll(@Query() query: VehicleFiltersInput) {
    const vehicles = await this.vehiclesService.findAll(query);
    return { vehicles };
  }

  @Get('filters/:id')
  async findById(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findById(id);
    return { vehicle };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findById(id);
    return { vehicle };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleInput) {
    const vehicle = await this.vehiclesService.update(id, dto);
    return { message: 'Vehículo actualizado exitosamente', vehicle };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const result = await this.vehiclesService.delete(id);
    return result;
  }
}