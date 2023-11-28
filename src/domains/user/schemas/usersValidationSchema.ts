import { z } from 'zod';
import pronounEnum from '../enums/pronounEnum';

const twoFactorSecretZodSchema = z.object({
    secret: z.string().optional(),
    qrcode: z.string().optional(),
    active: z.boolean(),
});

const updateUserDetails = z.object({
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    pronoun: z.enum(pronounEnum.values),
    birthday: z.string(),
    biography: z.string().max(500),
});

const usersZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32),
    nickname: z.string().max(32),
    picture: z.string().max(120).or(z.null()),
    twoFactorSecret: twoFactorSecretZodSchema,
});

export const emailUpdateZodSchema = z.object({
    email: z.string().email(),
});

export const passwordUpdateZodSchema = z.object({
    password: z.string().min(8).max(32),
});

export const updateUserZodSchema = z.object({
    nickname: z.string().max(32),
    picture: z.string().max(120).or(z.null()),
    details: updateUserDetails,
});

export const userLoginZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32),
});

export type UserPayload = z.infer<typeof usersZodSchema>;
export type UserInstance = z.infer<typeof usersZodSchema> & {
    userId: string;
    providerId: string;
    inProgress: {
        status: 'wait_to_confirm' | 'wait_to_complete' | 'wait_to_verify' | 'done';
        code: string;
    };
    tag: string;
    createdAt: string;
    updatedAt: string;
};

export type UserLogin = z.infer<typeof userLoginZodSchema>;
export type UserTwoFactor = z.infer<typeof twoFactorSecretZodSchema>;

export default usersZodSchema;
