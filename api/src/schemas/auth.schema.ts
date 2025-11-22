import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(6).max(200),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
