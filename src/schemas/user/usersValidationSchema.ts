import { z } from 'zod';

const inProgressZodSchema = z.object({
    status: z.enum(['wait_to_confirm', 'wait_to_complete']),
    code: z.number(),
});

const usersZodSchema = z.object({
    _id: z.string().length(24).optional(),
    inProgress: inProgressZodSchema.optional(),
    providerId: z.string().or(z.null()).optional(),
    email: z.string().email(),
    password: z.string().min(8).max(16),
    nickname: z.string().max(16).optional(),
    tag: z.string().length(5).optional(),
    picture: z.string().max(120).or(z.null()),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type User = z.infer<typeof usersZodSchema>;

export default usersZodSchema;
