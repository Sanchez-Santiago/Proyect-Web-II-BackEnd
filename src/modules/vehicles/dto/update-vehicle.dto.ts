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
  price: z.number().positive().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  lastServiceDate: z.string().datetime().optional(),
  lastOilChange: z.string().datetime().optional(),
  accidents: z.string().optional(),
  interiorCondition: z.number().int().min(1).max(10).optional(),
  paintCondition: z.number().int().min(1).max(10).optional(),
  rimsCondition: z.number().int().min(1).max(10).optional(),
  dashboardCondition: z.number().int().min(1).max(10).optional(),
  tiresCondition: z.number().int().min(1).max(10).optional(),
  description: z.string().optional(),
  images: z.array(z.object({ url: z.string(), title: z.string().optional() })).optional(),
});

export type UpdateVehicleInput = z.infer<typeof UpdateVehicleDto>;