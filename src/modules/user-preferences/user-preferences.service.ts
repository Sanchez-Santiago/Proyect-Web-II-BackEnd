import { Injectable, NotFoundException } from '@nestjs/common';
import { BuyerPreferenceModel } from '../../models/buyer-preference.model';
import { UpdateUserPreferenceInput } from './dto/update-user-preference.dto';

@Injectable()
export class UserPreferencesService {
  async upsert(userId: string, input: UpdateUserPreferenceInput) {
    return BuyerPreferenceModel.upsert(userId, {
      user: { connect: { id: userId } },
      minimumBudget: input.minimumBudget ? Number(input.minimumBudget) : null,
      maximumBudget: input.maximumBudget ? Number(input.maximumBudget) : null,
      preferredBrand: input.preferredBrand || null,
      preferredModel: input.preferredModel || null,
      minimumYear: input.minimumYear || null,
      maximumYear: input.maximumYear || null,
    });
  }

  async findByUserId(userId: string) {
    const preference = await BuyerPreferenceModel.findByUserId(userId);
    if (!preference) throw new NotFoundException('Preferencias no encontradas');
    return preference;
  }

  async delete(userId: string) {
    await BuyerPreferenceModel.delete(userId);
    return { message: 'Preferencias eliminadas correctamente' };
  }
}