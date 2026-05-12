import { z } from 'zod';

export const UpdateVehicleDto = z.object({
  vehicleType: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN', 'WAGON', 'CONVERTIBLE', 'SPORTS', 'ELECTRIC', 'OTHER']).optional(),
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().optional(),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG', 'OTHER']).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC', 'CVT', 'OTHER']).optional(),
  mileage: z.number().int().min(0).optional(),
  accidents: z.string().optional(),
  version: z.string().optional(),
  doors: z.number().int().min(1).max(10).optional(),
  engine: z.string().optional(),
  ownersCount: z.number().int().min(1).optional(),
  vin: z.string().optional(),
  licensePlate: z.string().optional(),
  hasDebt: z.boolean().optional(),
  debtAmount: z.number().positive().optional(),
  images: z.array(z.object({ url: z.string(), title: z.string().optional() })).optional(),
});

export type UpdateVehicleInput = z.infer<typeof UpdateVehicleDto>;