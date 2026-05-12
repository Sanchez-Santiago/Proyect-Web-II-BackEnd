import { z } from 'zod';

export const UpdateUserPreferenceDto = z.object({
  minBudget: z.number().positive().optional(),
  maxBudget: z.number().positive().optional(),
  preferredBrand: z.string().optional(),
  preferredModel: z.string().optional(),
  yearFrom: z.number().int().min(1900).optional(),
  yearTo: z.number().int().min(1900).optional(),
});

export type UpdateUserPreferenceInput = z.infer<typeof UpdateUserPreferenceDto>;
