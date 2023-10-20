import { z } from 'zod';

export const userLoginZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(16),
});

const twoFactorSecretZodSchema = z.object({
    secret: z.string().optional(),
    qrcode: z.string().optional(),
    active: z.boolean(),
});

const usersZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(16),
    nickname: z.string().max(32),
    picture: z.string().max(120).or(z.null()),
    twoFactorSecret: twoFactorSecretZodSchema,
});

export const emailUpdateZodSchema = z.object({
    email: z.string().email(),
});

export type UserPayload = z.infer<typeof usersZodSchema>;
export type UserInstance = z.infer<typeof usersZodSchema> & {
    userId: string;
    providerId: string;
    inProgress: {
        status: 'wait_to_confirm' | 'wait_to_complete' | 'wait_to_verify' | 'email_change' | 'done';
        code: string;
    };
    tag: string;
    createdAt: string;
    updatedAt: string;
};

export type UserLogin = z.infer<typeof userLoginZodSchema>;
export type UserTwoFactor = z.infer<typeof twoFactorSecretZodSchema>;

export default usersZodSchema;
