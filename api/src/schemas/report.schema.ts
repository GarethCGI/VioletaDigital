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

export const questionnaireInformantRoleSchema = z.enum([
  'VICTIM',
  'WITNESS',
  'PREFER_NOT_TO_SAY',
  'OTHER',
]);

export const questionnaireFrequencySchema = z.enum([
  'NEVER',
  'SOMETIMES',
  'OFTEN',
  'ALMOST_ALWAYS',
]);

export const questionnaireRiskLevelSchema = z.enum([
  'YELLOW',
  'ORANGE',
  'RED',
]);

export const questionnaireDataSchema = z.object({
  level0: z.object({
    informantRole: questionnaireInformantRoleSchema,
  }),
  level1: z.object({
    hurtfulJokes: questionnaireFrequencySchema,
    jealousyControlHumiliation: questionnaireFrequencySchema,
    exclusion: questionnaireFrequencySchema,
    physicalAggression: questionnaireFrequencySchema,
    digitalHarassment: questionnaireFrequencySchema,
  }),
  level3: z.object({
    damageAfterViolence: z.enum(['IMMEDIATE', 'AFTER_SOME', 'MOST_EPISODES', 'PRE_EXISTING']).optional(),
    wantsAnonymousRecord: z.boolean().optional(),
    wantsToIdentifyRelatedPerson: z.boolean().optional(),
    wantsAnonymousContact: z.boolean().optional(),
    preferredInitialContact: z.enum(['IN_APP', 'EMAIL', 'PHONE', 'NO_CONTACT']).optional(),
    preferredSupport: z.enum(['PSYCHOLOGICAL', 'ACADEMIC', 'LEGAL', 'SOCIAL']).optional(),
  }).optional(),
});

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
  questionnaireData: questionnaireDataSchema.optional(),
  riskLevel: questionnaireRiskLevelSchema.optional(),
});

// Query params for listing reports
export const listReportsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  role: reportRoleSchema.optional(),
  type: reportTypeSchema.optional(),
  informantRole: questionnaireInformantRoleSchema.optional(),
  riskLevel: questionnaireRiskLevelSchema.optional(),
  hasQuestionnaire: z.coerce.boolean().optional(),
});

// Type exports
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;
