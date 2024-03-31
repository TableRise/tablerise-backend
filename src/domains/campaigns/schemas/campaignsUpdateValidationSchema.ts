import { z } from 'zod';
import campaignVisibilityEnum from 'src/domains/campaigns/enums/campaignVisibilityEnum';

const campaignUpdateZodSchema = z.object({
    campaignId: z.string(),
    title: z.string().optional(),
    description: z.string().max(255).optional(),
    visibility: z.enum(campaignVisibilityEnum.values).optional(),
    cover: z.any().optional(),
});

export type CampaignUpdatePayload = z.infer<typeof campaignUpdateZodSchema>;
export default campaignUpdateZodSchema;
