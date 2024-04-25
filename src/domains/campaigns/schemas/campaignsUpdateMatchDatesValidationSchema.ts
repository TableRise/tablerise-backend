import { z } from 'zod';

const campaignsUpdateMatchDatesZodSchema = z.object({
    campaignId: z.string(),
    date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/),
    operation: z.enum(['add', 'remove']),
});

export type CampaignUpdatePayload = z.infer<typeof campaignsUpdateMatchDatesZodSchema>;
export default campaignsUpdateMatchDatesZodSchema;
