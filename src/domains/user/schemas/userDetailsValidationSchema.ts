import { z } from 'zod';
import pronounEnum from '../enums/pronounEnum';
import questionEnum from '../enums/questionEnum';

const gameInfoZodSchema = z.object({
    campaigns: z.array(z.string().length(24)),
    characters: z.array(z.string().length(24)),
    badges: z.array(z.string().length(24)),
});

export const secretQuestionZodSchema = z.object({
    question: z.enum(questionEnum.values),
    answer: z.string().max(80),
});

export const updateUserDetails = z.object({
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    pronoun: z.enum(pronounEnum.values),
    birthday: z.string(),
    biography: z.string().max(500),
});

const userDetailsZodSchema = z.object({
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    pronoun: z.enum(pronounEnum.values),
    secretQuestion: secretQuestionZodSchema.or(z.null()),
    birthday: z.string(),
    biography: z.string().max(500),
});

export type UserDetailPayload = z.infer<typeof userDetailsZodSchema>;
export type UserDetailInstance = z.infer<typeof userDetailsZodSchema> & {
    userId: string;
    userDetailId: string;
    gameInfo: {
        campaigns: string[];
        characters: string[];
        badges: string[];
    }
    role: 'user' | 'admin';
};

export type UserSecretQuestion = z.infer<typeof secretQuestionZodSchema>;
export type UserGameInfo = z.infer<typeof gameInfoZodSchema>;

export default userDetailsZodSchema;
