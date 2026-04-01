import { z } from 'zod';

export const CreateMessageDto = z.object({
  vehicleId: z.string().uuid(),
  receiverId: z.string().uuid(),
  message: z.string().min(1),
});

export const MessageFiltersDto = z.object({
  userId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  vehicleId: z.string().uuid().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageDto>;
export type MessageFiltersInput = z.infer<typeof MessageFiltersDto>;