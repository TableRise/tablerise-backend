import { z } from 'zod';

export const uuidV4Schema = z.string().length(36);

const parseJsonString = (value: unknown): unknown => {
    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

export const imageObjectRequestZodSchema = z.object({
    success: z.boolean(),
    status: z.number(),
});

export const imageObjectZodSchema = z.object({
    id: z.string(),
    title: z.string().default(''),
    link: z.string().url(),
    uploadDate: z.string().datetime(),
    thumbSizeUrl: z.string().optional(),
    mediumSizeUrl: z.string().optional(),
    deleteUrl: z.string(),
    request: imageObjectRequestZodSchema,
});

export const optionalImageObjectZodSchema = z.preprocess(parseJsonString, imageObjectZodSchema.optional());
export const optionalImageObjectArrayZodSchema = z.preprocess(
    parseJsonString,
    z.array(imageObjectZodSchema).optional()
);
