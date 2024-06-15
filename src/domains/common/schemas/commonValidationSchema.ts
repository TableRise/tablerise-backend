import { z } from 'zod';

export const uuidV4Schema = z.string().length(36);

export const imageObjectRequestZodSchema = z.object({
    success: z.boolean(),
    status: z.number(),
});

export const imageObjectZodSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    link: z.string().url(),
    uploadDate: z.string().datetime(),
    thumbSizeUrl: z.string().optional(),
    mediumSizeUrl: z.string().optional(),
    deleteUrl: z.string(),
    request: imageObjectRequestZodSchema,
});
