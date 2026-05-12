import { z } from 'zod';

export const CreateFavoriteSchema = z.object({
  publicationId: z.string().uuid(),
});

export type CreateFavoriteInput = z.infer<typeof CreateFavoriteSchema>;