import { z } from 'zod';
import pronounEnum from '../enums/pronounEnum';
import questionEnum from '../enums/questionEnum';
import { GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';
import { imageObjectZodSchema } from 'src/domains/common/schemas/commonValidationSchema';

const gameInfoCampaignsZodSchema = z.object({
    campaignId: z.string().length(24),
    role: z.string(),
    title: z.string(),
    description: z.string().max(255),
    cover: imageObjectZodSchema.optional(),
});

const gameInfoZodSchema = z.object({
    campaigns: z.array(gameInfoCampaignsZodSchema),
    characters: z.array(z.string().length(24)),
    badges: z.array(z.string().length(24)),
});

export const secretQuestionZodSchema = z.object({
    question: z.enum(questionEnum.values),
    answer: z.string().max(80),
});

export const updateUserDetails = z.object({
    firstName: z.string().max(16).optional(),
    lastName: z.string().max(80).optional(),
    pronoun: z.enum(pronounEnum.values).optional(),
    birthday: z.string().optional(),
    biography: z.string().max(500).optional(),
});

const userDetailsZodSchema = z.object({
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    pronoun: z.enum(pronounEnum.values),
    secretQuestion: secretQuestionZodSchema.or(z.null()),
    birthday: z.string(),
});

export type UserDetailPayload = z.infer<typeof userDetailsZodSchema>;
export type UserDetailInstance = z.infer<typeof userDetailsZodSchema> & {
    userId: string;
    userDetailId: string;
    gameInfo: {
        campaigns: GameInfoCampaigns[];
        characters: string[];
        badges: string[];
        bannedFromCampaigns: string[];
    };
    biography: string;
    role: 'user' | 'admin';
};

export type UserSecretQuestion = z.infer<typeof secretQuestionZodSchema>;
export type UserGameInfo = z.infer<typeof gameInfoZodSchema>;

export default userDetailsZodSchema;
