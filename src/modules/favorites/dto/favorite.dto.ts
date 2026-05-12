import { z } from 'zod';

export const CreateFavoriteDto = z.object({
  publicationId: z.string().uuid(),
});

export const FavoriteFiltersDto = z.object({
  brand: z.string().optional(),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type CreateFavoriteInput = z.infer<typeof CreateFavoriteDto>;
export type FavoriteFiltersInput = z.infer<typeof FavoriteFiltersDto>;
