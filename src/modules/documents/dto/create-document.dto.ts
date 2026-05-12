import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const DocumentTypeEnum = z.enum(['TITLE', 'VTV', 'INSURANCE', 'REGISTRATION', 'TRANSFER', 'OTHER']);

export const CreateDocumentSchema = z.object({
  documentUrl: z.string().url(),
  documentType: DocumentTypeEnum,
});

export class CreateDocumentDto extends createZodDto(CreateDocumentSchema) {}