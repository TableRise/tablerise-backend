import { z } from 'zod';

const godZodSchema = z.object({
  name: z.string(),
  alignment: z.string(),
  suggestedDomains: z.string(),
  symbol: z.string(),
  phanteon: z.string()
});

export type IGod = z.infer<typeof godZodSchema> & { _id?: string };

export default godZodSchema;
