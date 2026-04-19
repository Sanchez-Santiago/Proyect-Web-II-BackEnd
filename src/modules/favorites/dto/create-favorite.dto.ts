import { z } from 'zod';

export const CreateFavoriteDto = z.object({
  vehicleId: z.string().uuid(),
});

export type CreateFavoriteInput = z.infer<typeof CreateFavoriteDto>;