import { z } from 'zod';

export const PublicationFiltersDto = z.object({
  status: z.enum(['ACTIVE', 'PENDING', 'SOLD', 'CANCELLED', 'EXPIRED']).optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  yearMin: z.number().optional(),
  yearMax: z.number().optional(),
  vehicleType: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  sellerId: z.string().optional(),
});

export type PublicationFiltersInput = z.infer<typeof PublicationFiltersDto>;