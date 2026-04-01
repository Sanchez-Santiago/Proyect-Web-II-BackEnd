import { z } from 'zod';

export const CreateVehicleDto = z.object({
  vehicleType: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'VAN', 'WAGON', 'CONVERTIBLE', 'SPORTS', 'ELECTRIC', 'OTHER']),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
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

export const UpdateVehicleDto = CreateVehicleDto.partial();

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

export type CreateVehicleInput = z.infer<typeof CreateVehicleDto>;
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleDto>;
export type VehicleFiltersInput = z.infer<typeof VehicleFiltersDto>;