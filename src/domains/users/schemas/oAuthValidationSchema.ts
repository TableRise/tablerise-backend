import { z } from 'zod';

export const oAuthCompleteZodSchema = z.object({
    nickname: z.string().max(32),
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    birthday: z.string(),
    gender: z.string().max(32).optional(),
});

export type CompleteOAuthPayload = z.infer<typeof oAuthCompleteZodSchema>;
