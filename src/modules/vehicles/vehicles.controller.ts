import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleInput } from './dto/create-vehicle.dto';
import { UpdateVehicleInput } from './dto/update-vehicle.dto';
import { VehicleFiltersInput } from './dto/vehicle-filters.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleInput) {
    const vehicle = await this.vehiclesService.update(id, dto);
    return { message: 'Vehículo actualizado exitosamente', vehicle };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string) {
    const result = await this.vehiclesService.delete(id);
    return result;
  }

  // Endpoints para imágenes
  @Post(':id/images')
  @UseGuards(JwtGuard)
  async addImage(@Request() req: any, @Param('id') id: string, @Body() body: { url: string; title?: string }) {
    const image = await this.vehiclesService.addImage(req.user.userId, id, body.url, body.title);
    return { message: 'Imagen agregada', image };
  }

  @Post(':id/images/bulk')
  @UseGuards(JwtGuard)
  async addImagesBulk(@Request() req: any, @Param('id') id: string, @Body() body: { images: { url: string; title?: string }[] }) {
    const result = await this.vehiclesService.addImagesBulk(req.user.userId, id, body.images);
    return { message: `${result.count} imágenes agregadas`, count: result.count };
  }

  @Get(':id/images')
  async getImages(@Param('id') id: string) {
    const images = await this.vehiclesService.getImages(id);
    return { images };
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtGuard)
  async deleteImage(@Request() req: any, @Param('id') id: string, @Param('imageId') imageId: string) {
    const result = await this.vehiclesService.deleteImage(req.user.userId, imageId, id);
    return result;
  }
}