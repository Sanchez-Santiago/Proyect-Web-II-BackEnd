import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const isPastDate = (value: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(value) < today;
};

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  birthDate: z
    .string()
    .date('La fecha de nacimiento debe tener formato YYYY-MM-DD')
    .refine(isPastDate, 'La fecha de nacimiento debe ser anterior a hoy'),
  phone: z
    .string()
    .trim()
    .min(6, 'El teléfono debe tener al menos 6 caracteres'),
  alternatePhone: z.string().trim().min(6, 'El teléfono alternativo debe tener al menos 6 caracteres').optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  role: z.enum(['BUYER', 'SELLER', 'ADMIN']).optional().default('BUYER'),
  sellerType: z.enum(['PARTICULAR', 'AGENCIA', 'CONCESIONARIA']).optional(),
  businessName: z.string().trim().min(2, 'El nombre del negocio debe tener al menos 2 caracteres').optional(),
  taxId: z.string().trim().min(6, 'El CUIT/CUIL debe tener al menos 6 caracteres').optional(),
  contactEmail: z.string().trim().toLowerCase().email('Formato de email de contacto inválido').optional(),
  contactPhone: z.string().trim().min(6, 'El teléfono de contacto debe tener al menos 6 caracteres').optional(),
  province: z.string().trim().min(2, 'La provincia debe tener al menos 2 caracteres').optional(),
  city: z.string().trim().min(2, 'La ciudad debe tener al menos 2 caracteres').optional(),
  address: z.string().trim().min(2, 'La dirección debe tener al menos 2 caracteres').optional(),
  acceptsTradeIn: z.boolean().optional(),
  sellerDescription: z.string().trim().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  aiAutoReply: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export class RegisterDto extends createZodDto(RegisterSchema) {}
