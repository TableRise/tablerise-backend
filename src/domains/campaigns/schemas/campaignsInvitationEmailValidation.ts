import { z } from 'zod';

const campaignInvitationEmailZodSchema = z.object({
    targetEmail: z.string().email(),
    userId: z.string(),
    camapignId: z.string(),
});

export type campaignInvitationEmailPayload = z.infer<typeof campaignInvitationEmailZodSchema>;
export default campaignInvitationEmailZodSchema;
