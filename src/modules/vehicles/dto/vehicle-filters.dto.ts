import { z } from 'zod';

export const VehicleFiltersDto = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  yearMin: z.number().int().optional(),
  yearMax: z.number().int().optional(),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  vehicleType: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN', 'WAGON', 'CONVERTIBLE', 'SPORTS', 'ELECTRIC', 'OTHER']).optional(),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG', 'OTHER']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'OTHER']).optional(),
  mileageMin: z.number().int().min(0).optional(),
  mileageMax: z.number().int().min(0).optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  interiorConditionMin: z.number().int().min(1).max(10).optional(),
  paintConditionMin: z.number().int().min(1).max(10).optional(),
  createdAtFrom: z.string().datetime().optional(),
  createdAtTo: z.string().datetime().optional(),
  sellerId: z.string().uuid().optional(),
});

export type VehicleFiltersInput = z.infer<typeof VehicleFiltersDto>;