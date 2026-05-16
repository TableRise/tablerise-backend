import z from 'zod';
import { ICampaignsSchemas } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import campaignVisibilityEnum from 'src/domains/campaigns/enums/campaignVisibilityEnum';
import systemsEnum from 'src/domains/common/enums/systemsEnum';

const journalCategories = [
    'master',
    'admin',
    'players',
    'characters-players',
    'characters-master',
    'environment',
    'world-news',
    'announcements',
] as const;

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
    configurations: z.string(),
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

const configurationsBodySchema = z.object({
    shopOn: z.boolean(),
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
    configurations: configurationsBodySchema.optional(),
});

const postAddCampaignPlayersQuerySchema = z.object({
    password: z.string().optional(),
    userToAdd: z.uuid().optional(),
});

const postInvitePlayerByEmailQuerySchema = z.object({
    targetEmail: z.email(),
});

const postCreateCampaignPublishmentBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.string(),
});

const postCampaignLogBodySchema = z.object({
    loggedAt: z.string(),
    content: z.string(),
});

const campaignJournalHighlightPostSchema = z.object({
    postId: z.uuid().optional(),
    title: z.string(),
    author: z.object({
        userId: z.uuid(),
        characterIds: z.array(z.string()),
        role: z.enum(['admin_player', 'dungeon_master', 'player']),
        status: z.enum(['pending', 'active', 'inactive', 'banned']),
    }),
    content: z.string(),
    timestamp: z.string(),
    category: z.enum(journalCategories),
});

const patchUpdateCampaignJournalHighlightBodySchema = z
    .object({
        toggle: z.enum(['on', 'off']),
        post: campaignJournalHighlightPostSchema.optional(),
    })
    .refine((payload) => payload.toggle === 'off' || payload.post !== undefined, {
        path: ['post'],
        message: 'Post is required when toggle is on',
    });

const patchAddCampaignMatchDateQuerySchema = z.object({
    date: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/),
});

const patchUpdateCampaignMatchMapImagesBodySchema = z.object({
    mapImages: z.array(z.file()).max(3).optional(),
});

const patchAddCampaignMatchMusicsBodySchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
});

const patchRemoveCampaignMatchMusicBodySchema = z.object({
    id: z.string(),
});

const patchEditCampaignMatchMusicBodySchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
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

const patchUpdateCampaignCoverBodySchema = z.object({
    picture: z.file(),
});

const patchRemoveCampaignMatchMapImageQuerySchema = z.object({
    imageUrl: z.string(),
});

const patchUpdateCampaignJournalPostQuerySchema = z.object({
    userId: z.uuid(),
});

const patchUpdateCampaignJournalPostBodySchema = z.object({
    postId: z.uuid(),
    title: z.string(),
    post: z.string(),
    category: z.enum(journalCategories),
});

const patchDeleteCampaignJournalPostQuerySchema = z.object({
    userId: z.uuid(),
    postId: z.uuid(),
});

const getAllCampaignsQuerySchema = z.object({
    title: z.string().optional(),
    code: z.string().max(6).optional(),
});

export type TCreateCampaignBody = z.infer<typeof postCreateCampaignBodySchema>;
export type TUpdateCampaignBody = z.infer<typeof putUpdateCampaignBodySchema>;
export type TCreateCampaignPublishmentBody = z.infer<typeof postCreateCampaignPublishmentBodySchema>;
export type TPostCampaignLogBody = z.infer<typeof postCampaignLogBodySchema>;
export type TUpdateCampaignJournalHighlightBody = z.infer<typeof patchUpdateCampaignJournalHighlightBodySchema>;
export type TAddCampaignPlayersQuery = z.infer<typeof postAddCampaignPlayersQuerySchema>;
export type TInvitePlayerByEmailQuery = z.infer<typeof postInvitePlayerByEmailQuerySchema>;
export type TAddCampaignMatchDateQuery = z.infer<typeof patchAddCampaignMatchDateQuerySchema>;
export type TUpdateCampaignMatchMapImagesBody = z.infer<typeof patchUpdateCampaignMatchMapImagesBodySchema>;
export type TAddCampaignMatchMusicsBody = z.infer<typeof patchAddCampaignMatchMusicsBodySchema>;
export type TRemoveCampaignMatchMusicBody = z.infer<typeof patchRemoveCampaignMatchMusicBodySchema>;
export type TEditCampaignMatchMusicBody = z.infer<typeof patchEditCampaignMatchMusicBodySchema>;
export type TUpdateCampaignPlayerCharacterQuery = z.infer<typeof patchUpdateCampaignPlayerCharacterQuerySchema>;
export type TConfirmCampaignPlayerQuery = z.infer<typeof patchConfirmCampaignPlayerQuerySchema>;
const patchUpdateMatchCharacterPictureBodySchema = z.object({
    picture: z.file(),
});

export type TTransferDungeonMasterQuery = z.infer<typeof patchTransferDungeonMasterQuerySchema>;
export type TUpdateMatchCharacterPictureBody = z.infer<typeof patchUpdateMatchCharacterPictureBodySchema>;
export type TUpdateCampaignCoverBodySchema = z.infer<typeof patchUpdateCampaignCoverBodySchema>;
export type TRemoveCampaignMatchMapImageQuery = z.infer<typeof patchRemoveCampaignMatchMapImageQuerySchema>;
export type TGetAllCampaignsQuery = z.infer<typeof getAllCampaignsQuerySchema>;
export type TUpdateCampaignPlayerLimitQuery = z.infer<typeof patchUpdateCampaignPlayerLimitQuerySchema>;
export type TConfirmPlayerPresenceQuery = z.infer<typeof postConfirmPlayerPresenceQuerySchema>;
export type TUpdateCampaignJournalPostQuery = z.infer<typeof patchUpdateCampaignJournalPostQuerySchema>;
export type TUpdateCampaignJournalPostBody = z.infer<typeof patchUpdateCampaignJournalPostBodySchema>;
export type TDeleteCampaignJournalPostQuery = z.infer<typeof patchDeleteCampaignJournalPostQuerySchema>;

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
    postInvitePlayerByEmail: {
        query: postInvitePlayerByEmailQuerySchema,
    },
    postCreateCampaignPublishment: {
        body: postCreateCampaignPublishmentBodySchema,
    },
    postCampaignLog: {
        body: postCampaignLogBodySchema,
    },
    patchAddCampaignMatchDate: {
        query: patchAddCampaignMatchDateQuerySchema,
    },
    patchUpdateCampaignMatchMapImages: {
        body: patchUpdateCampaignMatchMapImagesBodySchema,
    },
    patchAddCampaignMatchMusics: {
        body: patchAddCampaignMatchMusicsBodySchema,
    },
    patchRemoveCampaignMatchMusic: {
        body: patchRemoveCampaignMatchMusicBodySchema,
    },
    patchEditCampaignMatchMusic: {
        body: patchEditCampaignMatchMusicBodySchema,
    },
    patchUpdateCampaignPlayerCharacter: {
        query: patchUpdateCampaignPlayerCharacterQuerySchema,
    },
    patchRemoveCampaignPlayerCharacter: {
        query: patchUpdateCampaignPlayerCharacterQuerySchema,
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
    patchRemoveCampaignMatchMapImage: {
        query: patchRemoveCampaignMatchMapImageQuerySchema,
    },
    patchTransferDungeonMaster: {
        query: patchTransferDungeonMasterQuerySchema,
    },
    patchUpdateMatchCharacterPicture: {
        body: patchUpdateMatchCharacterPictureBodySchema,
    },
    patchUpdateCampaignJournalHighlight: {
        body: patchUpdateCampaignJournalHighlightBodySchema,
    },
    patchUpdateCampaignJournalPost: {
        query: patchUpdateCampaignJournalPostQuerySchema,
        body: patchUpdateCampaignJournalPostBodySchema,
    },
    patchDeleteCampaignJournalPost: {
        query: patchDeleteCampaignJournalPostQuerySchema,
    },
});
