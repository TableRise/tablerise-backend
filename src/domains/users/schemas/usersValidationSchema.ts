import { z } from 'zod';
import { updateUserDetails } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

const twoFactorSecretZodSchema = z.object({
    secret: z.string().optional(),
    qrcode: z.string().optional(),
    active: z.boolean(),
});

const usersZodSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
        message: 'Invalid password',
    }),
    nickname: z.string().max(32),
});

export const emailUpdateZodSchema = z.object({
    email: z.string().email(),
});

export const passwordUpdateZodSchema = z.object({
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
        message: 'Invalid password',
    }),
});

export const updateUserZodSchema = z.object({
    nickname: z.string().max(32).optional(),
    details: updateUserDetails.optional(),
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
        status:
            | 'done'
            | 'wait_to_complete'
            | 'wait_to_confirm'
            | 'wait_to_delete'
            | 'wait_to_verify'
            | 'waiting_question';
        code: string;
    };
    twoFactorSecret: {
        qrcode?: string;
        secret?: string;
        active: boolean;
    };
    picture: ImageObject | null;
    tag: string;
    createdAt: string;
    updatedAt: string;
};

export type UserLogin = z.infer<typeof userLoginZodSchema>;
export type UserTwoFactor = z.infer<typeof twoFactorSecretZodSchema>;

export default usersZodSchema;
