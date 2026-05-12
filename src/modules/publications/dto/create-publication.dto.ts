import { z } from 'zod';

export const CreatePublicationDto = z.object({
  vehicleId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  currency: z.string().default('USD'),
  province: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type CreatePublicationInput = z.infer<typeof CreatePublicationDto>;