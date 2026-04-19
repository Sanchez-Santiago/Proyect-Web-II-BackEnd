import { z } from 'zod';

export const CreateMessageDto = z.object({
  vehicleId: z.string().uuid(),
  receiverId: z.string().uuid(),
  message: z.string().min(1),
});

export type CreateMessageInput = z.infer<typeof CreateMessageDto>;