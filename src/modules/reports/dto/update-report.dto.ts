import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ReportStatusEnum = z.enum(['PENDING', 'RESOLVED', 'DISMISSED']);

export const UpdateReportStatusSchema = z.object({
  status: ReportStatusEnum,
});

export class UpdateReportStatusDto extends createZodDto(UpdateReportStatusSchema) {}