import { z } from 'zod';

export const CreateMessageDto = z.object({
  chatId: z.string().uuid(),
  buyerId: z.string().uuid(),
  sellerId: z.string().uuid(),
  publicationId: z.string().uuid().optional(),
  message: z.string().min(1),
  status: z.enum(['ENVIADO', 'LEIDO', 'ELIMINADO']).optional(),
  leadStatus: z.enum(['NUEVO', 'CONTACTADO', 'NEGOCIANDO', 'GANADO', 'PERDIDO']).optional(),
});

export const MessageFiltersDto = z.object({
  userId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  chatId: z.string().uuid().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageDto>;
export type MessageFiltersInput = z.infer<typeof MessageFiltersDto>;
