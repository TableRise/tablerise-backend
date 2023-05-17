import { z } from 'zod';

const campaignZodSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  system_id: z.string(),
  creature_ids: z.array(z.string()),
  character_ids: z.array(z.string()),
  environments: z.array(z.object({
    name: z.string(),
    description: z.string(),
    character_ids: z.array(z.string()),
    thumbnail: z.string()
  })),
  infos: z.string(),
  status: z.boolean().default(true)
});

type ICampaign = z.infer<typeof campaignZodSchema>;

export { type ICampaign, campaignZodSchema };
