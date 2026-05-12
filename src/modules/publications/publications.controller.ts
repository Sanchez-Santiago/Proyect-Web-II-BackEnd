import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationInput } from './dto/create-publication.dto';
import { UpdatePublicationInput } from './dto/update-publication.dto';
import { PublicationFiltersInput } from './dto/publication-filters.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Request() req: any, @Body() dto: CreatePublicationInput) {
    const publication = await this.publicationsService.create(req.user.userId, dto);
    return { message: 'Publicación creada exitosamente', publication };
  }

  @Get('filters')
  async findAll(@Query() query: PublicationFiltersInput) {
    const publications = await this.publicationsService.findAll(query);
    return { publications };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const publication = await this.publicationsService.findById(id);
    return { publication };
  }

  @Get('vehicle/:vehicleId')
  async getByVehicleId(@Param('vehicleId') vehicleId: string) {
    const publication = await this.publicationsService.getByVehicleId(vehicleId);
    return { publication };
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdatePublicationInput) {
    const publication = await this.publicationsService.update(id, req.user.userId, dto);
    return { message: 'Publicación actualizada exitosamente', publication };
  }

  @Put(':id/status')
  @UseGuards(JwtGuard)
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const publication = await this.publicationsService.updateStatus(id, req.user.userId, body.status);
    return { message: 'Estado actualizado', publication };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Request() req: any, @Param('id') id: string) {
    const result = await this.publicationsService.delete(id, req.user.userId);
    return result;
  }

  @Post(':id/features')
  @UseGuards(JwtGuard)
  async addFeature(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { featureId: string },
  ) {
    const result = await this.publicationsService.addFeature(id, body.featureId, req.user.userId);
    return { message: 'Característica agregada', result };
  }

  @Delete(':id/features/:featureId')
  @UseGuards(JwtGuard)
  async removeFeature(
    @Request() req: any,
    @Param('id') id: string,
    @Param('featureId') featureId: string,
  ) {
    const result = await this.publicationsService.removeFeature(id, featureId, req.user.userId);
    return { message: 'Característica eliminada', result };
  }

  @Get(':id/features')
  async getFeatures(@Param('id') id: string) {
    const features = await this.publicationsService.getFeatures(id);
    return { features };
  }
}