import { Injectable, NotFoundException } from '@nestjs/common';
import { SavedSearchModel } from '../../models/saved-search.model';

@Injectable()
export class SavedSearchesService {
  async create(userId: string, filtersJson: Record<string, any>) {
    return SavedSearchModel.create(userId, filtersJson);
  }

  async findAll(userId: string) {
    return SavedSearchModel.findByUserId(userId);
  }

  async findById(id: string) {
    const search = await SavedSearchModel.findById(id);
    if (!search) throw new NotFoundException('Búsqueda guardada no encontrada');
    return search;
  }

  async update(id: string, userId: string, filtersJson: Record<string, any>) {
    const search = await SavedSearchModel.findById(id);
    if (!search) throw new NotFoundException('Búsqueda guardada no encontrada');
    if (search.userId !== userId) throw new NotFoundException('No autorizado');
    return SavedSearchModel.update(id, filtersJson);
  }

  async delete(id: string, userId: string) {
    const search = await SavedSearchModel.findById(id);
    if (!search) throw new NotFoundException('Búsqueda guardada no encontrada');
    if (search.userId !== userId) throw new NotFoundException('No autorizado');
    return SavedSearchModel.delete(id);
  }
}