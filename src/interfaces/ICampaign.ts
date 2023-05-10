import { z } from 'zod';

const campaignZodSchema = z.object({
  title: z.string(),
  system: z.enum([
    'dungeons&dragons-5e'
  ]),
  players: z.array(z.string()),
  creatures: z.array(z.string()),
  characters: z.array(z.string()),
  environments: z.array(z.object({
    name: z.string(),
    history: z.string(),
    natives: z.string(),
    goal: z.string(),
    thumbnail: z.string(),
  })),
  infos: z.object({
    background: z.string(),
    notes: z.object({
      title: z.string(),
      content: z.string(),
    })
  }),
  status: z.boolean().default(true),
});

type ICampaign = z.infer<typeof campaignZodSchema>;

export { ICampaign, campaignZodSchema };
