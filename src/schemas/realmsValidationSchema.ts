import { z } from 'zod';

const realmZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  thumbnail: z.string()
});

export type IRealm = z.infer<typeof realmZodSchema> & { _id?: string };

export default realmZodSchema;
