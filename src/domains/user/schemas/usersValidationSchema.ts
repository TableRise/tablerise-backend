import { z } from 'zod';
import { updateUserDetails } from 'src/domains/user/schemas/userDetailsValidationSchema';

const twoFactorSecretZodSchema = z.object({
    secret: z.string().optional(),
    qrcode: z.string().optional(),
    active: z.boolean(),
});

const userPictureZodSchema = z.object({
    link: z.string().max(120),
    id: z.string().max(120),
    uploadDate: z.date(),
});

const usersZodSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/),
    nickname: z.string().max(32),
});

export const emailUpdateZodSchema = z.object({
    email: z.string().email(),
});

export const passwordUpdateZodSchema = z.object({
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/),
});

export const updateUserZodSchema = z.object({
    nickname: z.string().max(32),
    picture: userPictureZodSchema.or(z.null()),
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
    twoFactorSecret: {
        qrcode?: string;
        secret?: string;
        active: boolean
    },
    picture: {
        link: string;
        id: string;
        uploadDate: Date;
    } | null;
    tag: string;
    createdAt: string;
    updatedAt: string;
};

export type UserLogin = z.infer<typeof userLoginZodSchema>;
export type UserTwoFactor = z.infer<typeof twoFactorSecretZodSchema>;

export default usersZodSchema;
