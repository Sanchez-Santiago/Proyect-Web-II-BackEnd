import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SavedSearchesService } from './saved-searches.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('saved-searches')
@UseGuards(JwtGuard)
export class SavedSearchesController {
  constructor(private savedSearchesService: SavedSearchesService) {}

  @Post()
  async create(@Request() req: any, @Body() body: { filters: Record<string, any> }) {
    const search = await this.savedSearchesService.create(req.user.userId, body.filters);
    return { message: 'Búsqueda guardada', search };
  }

  @Get()
  async findAll(@Request() req: any) {
    const searches = await this.savedSearchesService.findAll(req.user.userId);
    return { searches };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const search = await this.savedSearchesService.findById(id);
    return { search };
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() body: { filters: Record<string, any> }) {
    const search = await this.savedSearchesService.update(id, req.user.userId, body.filters);
    return { message: 'Búsqueda actualizada', search };
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    const result = await this.savedSearchesService.delete(id, req.user.userId);
    return result;
  }
}