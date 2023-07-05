import { z } from 'zod';

const realmZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  thumbnail: z.string()
});

export type Realm = z.infer<typeof realmZodSchema>;

export default realmZodSchema;
