import { z } from 'zod';

// Report role enum
export const reportRoleSchema = z.enum([
  'Docente',
  'Alumno',
  'Autoridad Educativa',
  'PAAE',
  'Otro',
]);

// Report type enum
export const reportTypeSchema = z.enum([
  'Violencia',
  'Acoso',
  'Discriminación',
]);

// Create report schema
export const createReportSchema = z.object({
  role: reportRoleSchema,
  type: reportTypeSchema,
  description: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(5000, 'La descripción no puede exceder 5000 caracteres'),
  location: z.string()
    .max(255, 'La ubicación no puede exceder 255 caracteres')
    .optional(),
  date: z.string()
    .max(100, 'La fecha no puede exceder 100 caracteres')
    .optional(),
  witnesses: z.string()
    .max(2000, 'Los testigos no pueden exceder 2000 caracteres')
    .optional(),
  additionalInfo: z.string()
    .max(5000, 'La información adicional no puede exceder 5000 caracteres')
    .optional(),
});

// Query params for listing reports
export const listReportsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  role: reportRoleSchema.optional(),
  type: reportTypeSchema.optional(),
});

// Type exports
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;
