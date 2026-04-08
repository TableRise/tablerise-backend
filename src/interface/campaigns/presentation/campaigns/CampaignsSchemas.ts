import z from 'zod';
import { ICampaignsSchemas } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import campaignVisibilityEnum from 'src/domains/campaigns/enums/campaignVisibilityEnum';
import systemsEnum from 'src/domains/common/enums/systemsEnum';
import { imageObjectZodSchema } from 'src/domains/common/schemas/commonValidationSchema';

const postCreateCampaignBodySchema = z.object({
    title: z.string(),
    cover: imageObjectZodSchema.or(z.string()).optional(),
    description: z.string().max(255),
    visibility: z.enum(campaignVisibilityEnum.values).optional(),
    system: z.enum(systemsEnum.values),
    ageRestriction: z.number(),
    password: z.string().regex(/^\d{4}$/, {
        message: 'Invalid password',
    }),
});

const putUpdateCampaignBodySchema = z.object({
    campaignId: z.string(),
    title: z.string().optional(),
    description: z.string().max(255).optional(),
    visibility: z.enum(campaignVisibilityEnum.values).optional(),
    cover: z.file().optional(),
});

const postAddCampaignPlayersQuerySchema = z.object({
    campaignId: z.string(),
    userId: z.string(),
    password: z.string().regex(/^\d{4}$/, {
        message: 'Invalid password',
    }),
});

const postBanCampaignPlayerQuerySchema = z.object({
    playerId: z.uuid(),
});

const postInvitePlayerByEmailQuerySchema = z.object({
    targetEmail: z.email(),
});

const postCreateCampaignPublishmentBodySchema = z.object({
    title: z.string(),
    content: z.string().max(250),
});

const patchUpdateCampaignMatchDateQuerySchema = z.object({
    date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/),
    operation: z.enum(['add', 'remove']),
});

const patchUpdateCampaignMatchMapImagesBodySchema = z.object({
    operation: z.enum(['add', 'remove']),
    imageId: z.string(),
    mapImage: z.file(),
});

const patchUpdateCampaignMatchMusicsBodySchema = z.object({
    operation: z.enum(['add', 'remove']),
    title: z.string(),
    youtubeLink: z.string(),
});

const patchUpdateCampaignPlayerCharacterQuerySchema = z.object({
    characterId: z.uuid(),
});

const patchUpdateCampaignImagesBodySchema = z.object({
    imageId: z.string(),
    name: z.string(),
    operation: z.enum(['add', 'remove']),
});

export type TCreateCampaignBody = z.infer<typeof postCreateCampaignBodySchema>;
export type TUpdateCampaignBody = z.infer<typeof putUpdateCampaignBodySchema>;
export type TCreateCampaignPublishmentBody = z.infer<typeof postCreateCampaignPublishmentBodySchema>;
export type TAddCampaignPlayersQuery = z.infer<typeof postAddCampaignPlayersQuerySchema>;
export type TBanCampaignPlayerQuery = z.infer<typeof postBanCampaignPlayerQuerySchema>;
export type TInvitePlayerByEmailQuery = z.infer<typeof postInvitePlayerByEmailQuerySchema>;
export type TUpdateCampaignMatchDateQuery = z.infer<typeof patchUpdateCampaignMatchDateQuerySchema>;
export type TUpdateCampaignMatchMapImagesBody = z.infer<typeof patchUpdateCampaignMatchMapImagesBodySchema>;
export type TUpdateCampaignMatchMusicsBody = z.infer<typeof patchUpdateCampaignMatchMusicsBodySchema>;
export type TUpdateCampaignPlayerCharacterQuery = z.infer<typeof patchUpdateCampaignPlayerCharacterQuerySchema>;
export type TUpdateCampaignImagesBodySchema = z.infer<typeof patchUpdateCampaignImagesBodySchema>;

export default (): ICampaignsSchemas => ({
    postCreateCampaign: {
        body: postCreateCampaignBodySchema,
    },
    putUpdateCampaign: {
        body: putUpdateCampaignBodySchema,
    },
    postAddCampaignPlayers: {
        query: postAddCampaignPlayersQuerySchema,
    },
    postBanCampaignPlayer: {
        query: postBanCampaignPlayerQuerySchema,
    },
    postInvitePlayerByEmail: {
        query: postInvitePlayerByEmailQuerySchema,
    },
    postCreateCampaignPublishment: {
        body: postCreateCampaignPublishmentBodySchema,
    },
    patchUpdateCampaignMatchDate: {
        query: patchUpdateCampaignMatchDateQuerySchema,
    },
    patchUpdateCampaignMatchMapImages: {
        body: patchUpdateCampaignMatchMapImagesBodySchema,
    },
    patchUpdateCampaignMatchMusics: {
        body: patchUpdateCampaignMatchMusicsBodySchema,
    },
    patchUpdateCampaignPlayerCharacter: {
        body: patchUpdateCampaignMatchMusicsBodySchema,
    },
    patchUpdateCampaignImages: {
        body: patchUpdateCampaignImagesBodySchema,
    },
});
