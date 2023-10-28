import { z } from 'zod';
import pronounEnum from '../enums/pronounEnum';

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
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    pronoun: z.enum(pronounEnum.values),
    secretQuestion: secretQuestionZodSchema.or(z.null()),
    birthday: z.string(),
    gameInfo: gameInfoZodSchema,
    biography: z.string().max(500),
    role: z.enum(['user', 'admin']),
});

export type UserDetailPayload = z.infer<typeof userDetailsZodSchema>;
export type UserDetailInstance = z.infer<typeof userDetailsZodSchema> & {
    userId: string;
    userDetailId: string;
};

export type UserSecretQuestion = z.infer<typeof secretQuestionZodSchema>;
export type UserGameInfo = z.infer<typeof gameInfoZodSchema>;

export default userDetailsZodSchema;
