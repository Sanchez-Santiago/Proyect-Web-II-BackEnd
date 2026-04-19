import { z } from 'zod';

export const MessageFiltersDto = z.object({
  userId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  vehicleId: z.string().uuid().optional(),
});

export type MessageFiltersInput = z.infer<typeof MessageFiltersDto>;