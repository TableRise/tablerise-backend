import { z } from 'zod';

export const uuidV4Schema = z.string().length(36);

export const imageObjectZodSchema = z.object({
    id: z.string(),
    link: z.string().url(),
    uploadDate: z.date(),
});
