import { z } from 'zod';

const magicItemZodSchema = z.object({
    name: z.string(),
    characteristics: z.array(z.string()),
    description: z.string(),
});

export type MagicItem = z.infer<typeof magicItemZodSchema>;
export default magicItemZodSchema;
