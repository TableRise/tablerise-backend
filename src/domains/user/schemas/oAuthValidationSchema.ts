import { z } from 'zod';
import pronounEnum from '../enums/pronounEnum';

export const oAuthCompleteZodSchema = z.object({
    nickname: z.string().max(32),
    picture: z.string().max(120).or(z.null()),
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    pronoun: z.enum(pronounEnum.values),
    birthday: z.string(),
    biography: z.string().max(500),
});

export type CompleteOAuthPayload = z.infer<typeof oAuthCompleteZodSchema>;
