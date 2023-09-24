import { z } from 'zod';

const godZodSchema = z.object({
    name: z.string(),
    alignment: z.string(),
    suggestedDomains: z.string(),
    symbol: z.string(),
    pantheon: z.string(),
});

export type God = z.infer<typeof godZodSchema>;

export default godZodSchema;
