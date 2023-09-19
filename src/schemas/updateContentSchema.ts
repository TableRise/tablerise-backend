import { z } from 'zod';

const updateContentZodSchema = z.object({
    method: z.enum(['add', 'remove']),
    newID: z.string(),
});

export type UpdateContent = z.infer<typeof updateContentZodSchema>;
export default updateContentZodSchema;
