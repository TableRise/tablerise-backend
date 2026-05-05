import z from 'zod';
import { ICampaignsSchemas } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import campaignVisibilityEnum from 'src/domains/campaigns/enums/campaignVisibilityEnum';
import systemsEnum from 'src/domains/common/enums/systemsEnum';

const postCreateCampaignBodySchema = z.object({
    title: z.string(),
    cover: z.file().optional(),
    mapImages: z.array(z.file()).max(3).optional(),
    description: z.string().max(255),
    visibility: z.enum(campaignVisibilityEnum.values).optional(),
    system: z.enum(systemsEnum.values),
    musics: z.string(),
    nextMatchDate: z.string().optional(),
    lore: z.string(),
    playerAmountLimit: z.string(),
    ageRestriction: z.string(),
    socialMedia: z.string().optional(),
    password: z
        .string()
        .regex(/^[a-zA-Z0-9]{4}$/, {
            message: 'Invalid password',
        })
        .optional(),
});

const patchUpdateCampaignPlayerLimitQuerySchema = z.object({
    newLimit: z.number().min(1),
});

const postConfirmPlayerPresenceQuerySchema = z.object({
    cancel: z.boolean().default(false).optional(),
});

const putUpdateCampaignBodySchema = z.object({
    title: z.string().optional(),
    description: z.string().max(255).optional(),
    visibility: z.enum(campaignVisibilityEnum.values).optional(),
    ageRestriction: z.enum(['L', '10', '14', '16', '+18']).optional(),
    nextMatchDate: z.string().optional(),
    nextSessionResume: z.string().max(1000).optional(),
    playerAmountLimit: z.number().int().min(1).optional(),
    socialMedia: z
        .object({
            discord: z.string().optional(),
            twitter: z.string().optional(),
            youtube: z.string().optional(),
        })
        .optional(),
    adminId: z.string().optional(),
});

const postAddCampaignPlayersQuerySchema = z.object({
    password: z.string().optional(),
    userToAdd: z.uuid().optional(),
});

const postBanCampaignPlayerQuerySchema = z.object({
    playerId: z.uuid(),
});

const postInvitePlayerByEmailQuerySchema = z.object({
    targetEmail: z.email(),
});

const postCreateCampaignPublishmentBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.string(),
});

const patchUpdateCampaignMatchDateQuerySchema = z.object({
    date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/),
    operation: z.enum(['add', 'remove']),
});

const patchUpdateCampaignMatchMapImagesBodySchema = z.object({
    mapImages: z.array(z.file()).max(3).optional(),
});

const patchUpdateCampaignMatchMusicsBodySchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
    operation: z.enum(['add', 'remove']),
});

const patchUpdateCampaignPlayerCharacterQuerySchema = z.object({
    characterId: z.uuid(),
});

const patchConfirmCampaignPlayerQuerySchema = z.object({
    userToActivate: z.uuid(),
});

const patchTransferDungeonMasterQuerySchema = z.object({
    userToMaster: z.uuid(),
});

const patchUpdateCampaignImagesBodySchema = z.object({
    imageId: z.string().optional(),
    picture: z.file().optional(),
    operation: z.enum(['add', 'remove']),
});

const patchUpdateCampaignCoverBodySchema = z.object({
    picture: z.file(),
});

const patchRemoveCampaignImageQuerySchema = z.object({
    imageUrl: z.string().url(),
    type: z.enum(['cover', 'mapImages']),
});

const getAllCampaignsQuerySchema = z.object({
    title: z.string().optional(),
    code: z.string().max(6).optional(),
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
export type TConfirmCampaignPlayerQuery = z.infer<typeof patchConfirmCampaignPlayerQuerySchema>;
const patchUpdateMatchCharacterPictureBodySchema = z.object({
    picture: z.file(),
});

export type TTransferDungeonMasterQuery = z.infer<typeof patchTransferDungeonMasterQuerySchema>;
export type TUpdateMatchCharacterPictureBody = z.infer<typeof patchUpdateMatchCharacterPictureBodySchema>;
export type TUpdateCampaignImagesBodySchema = z.infer<typeof patchUpdateCampaignImagesBodySchema>;
export type TUpdateCampaignCoverBodySchema = z.infer<typeof patchUpdateCampaignCoverBodySchema>;
export type TRemoveCampaignImageQuery = z.infer<typeof patchRemoveCampaignImageQuerySchema>;
export type TGetAllCampaignsQuery = z.infer<typeof getAllCampaignsQuerySchema>;
export type TUpdateCampaignPlayerLimitQuery = z.infer<typeof patchUpdateCampaignPlayerLimitQuerySchema>;
export type TConfirmPlayerPresenceQuery = z.infer<typeof postConfirmPlayerPresenceQuerySchema>;

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
        query: patchUpdateCampaignPlayerCharacterQuerySchema,
    },
    patchRemoveCampaignPlayerCharacter: {
        query: patchUpdateCampaignPlayerCharacterQuerySchema,
    },
    patchUpdateCampaignImages: {
        body: patchUpdateCampaignImagesBodySchema,
    },
    patchUpdateCampaignPlayerLimit: {
        query: patchUpdateCampaignPlayerLimitQuerySchema,
    },
    getAllCampaigns: {
        query: getAllCampaignsQuerySchema,
    },
    postConfirmPlayerPresence: {
        query: postConfirmPlayerPresenceQuerySchema,
    },
    patchConfirmCampaignPlayer: {
        query: patchConfirmCampaignPlayerQuerySchema,
    },
    patchUpdateCampaignCover: {
        body: patchUpdateCampaignCoverBodySchema,
    },
    patchRemoveCampaignImage: {
        query: patchRemoveCampaignImageQuerySchema,
    },
    patchTransferDungeonMaster: {
        query: patchTransferDungeonMasterQuerySchema,
    },
    patchUpdateMatchCharacterPicture: {
        body: patchUpdateMatchCharacterPictureBodySchema,
    },
});
