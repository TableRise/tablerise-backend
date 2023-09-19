import { z } from 'zod';

const gameInfoZodSchema = z.object({
    campaigns: z.array(z.string().length(24)),
    characters: z.array(z.string().length(24)),
    badges: z.array(z.string().length(24)),
});

const secretQuestionZodSchema = z.object({
    question: z.string().max(120),
    answer: z.string().max(80),
});

const userDetailsZodSchema = z.object({
    userId: z.string().length(24).optional(),
    firstName: z.string().max(16).or(z.null()),
    lastName: z.string().max(80).or(z.null()),
    pronoun: z.enum(['he/his', 'she/her', 'they/them', 'he/his - she/her', 'any']).or(z.null()),
    secretQuestion: secretQuestionZodSchema.or(z.null()),
    birthday: z.string().or(z.null()),
    gameInfo: gameInfoZodSchema,
    biography: z.string().max(500).or(z.null()),
    role: z.enum(['user', 'admin']),
});

export type UserDetail = z.infer<typeof userDetailsZodSchema>;
export type UserSecretQuestion = z.infer<typeof secretQuestionZodSchema>;
export type UserGameInfo = z.infer<typeof gameInfoZodSchema>;

export default userDetailsZodSchema;
