import { z } from 'zod';

export const UpdatePublicationDto = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'SOLD', 'CANCELLED', 'EXPIRED']).optional(),
});

export type UpdatePublicationInput = z.infer<typeof UpdatePublicationDto>;