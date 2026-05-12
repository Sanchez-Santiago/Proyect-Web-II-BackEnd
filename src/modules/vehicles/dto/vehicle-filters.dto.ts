import { z } from 'zod';

export const VehicleFiltersDto = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  yearMin: z.number().int().optional(),
  yearMax: z.number().int().optional(),
  vehicleType: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN', 'WAGON', 'CONVERTIBLE', 'SPORTS', 'ELECTRIC', 'OTHER']).optional(),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG', 'OTHER']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'OTHER']).optional(),
  mileageMin: z.number().int().min(0).optional(),
  mileageMax: z.number().int().min(0).optional(),
  version: z.string().optional(),
  doors: z.number().int().min(1).max(10).optional(),
  engine: z.string().optional(),
  createdAtFrom: z.string().datetime().optional(),
  createdAtTo: z.string().datetime().optional(),
  sellerId: z.string().uuid().optional(),
});

export type VehicleFiltersInput = z.infer<typeof VehicleFiltersDto>;