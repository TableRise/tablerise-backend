import z from 'zod';
import { ICampaignsSchemas } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import campaignVisibilityEnum from 'src/domains/campaigns/enums/campaignVisibilityEnum';
import systemsEnum from 'src/domains/common/enums/systemsEnum';
import uploadedFileSchema from 'src/interface/common/helpers/uploadedFileSchema';

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
    cover: uploadedFileSchema.optional(),
    mapImages: z.array(uploadedFileSchema).max(3).optional(),
    description: z.string().max(255),
    visibility: z.enum(campaignVisibilityEnum.values).optional(),
    system: z.enum(systemsEnum.values),
    musics: z.string(),
    nextMatchDate: z.string().optional(),
    playerAmountLimit: z.string(),
    ageRestriction: z.string(),
    socialMedia: z.string().optional(),
    configurations: z.string(),
    mainHistory: z.string(),
    password: z
        .string()
        .regex(/^[a-zA-Z0-9]{4}$/, {
            message: 'Invalid password',
        })
        .optional(),
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

const postRemoveCampaignPlayersQuerySchema = z.object({
    userToRemove: z.uuid().optional(),
});

const postCreateCampaignPublishmentBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.string(),
});

const postCampaignBuyBodySchema = z.object({
    name: z.string(),
    cost: z.string(),
    character: z.string(),
    user: z.string(),
    date: z.string(),
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

const patchUpdateCampaignMatchMapImagesBodySchema = z.object({
    mapImages: z.array(uploadedFileSchema).max(3).optional(),
});

const patchUpdateCampaignMatchImagesBodySchema = z.object({
    images: z.array(uploadedFileSchema).optional(),
});

const patchHighlightCampaignMatchImageQuerySchema = z
    .object({
        imageId: z.string().optional(),
        remove: z.preprocess((value) => {
            if (typeof value === 'string') return value === 'true';
            return value;
        }, z.boolean().optional()),
    })
    .refine((payload) => payload.remove === true || payload.imageId !== undefined, {
        path: ['imageId'],
        message: 'imageId is required when remove is false',
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
    picture: uploadedFileSchema,
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

const patchUpdateCampaignPlayerNoteQuerySchema = z.object({
    title: z.string(),
});

const patchUpdateCampaignPlayerNoteBodySchema = z.object({
    content: z.string(),
});

const patchRemoveCampaignPlayerNoteQuerySchema = z.object({
    title: z.string(),
});

const getAllCampaignsQuerySchema = z.object({
    title: z.string().optional(),
    code: z.string().max(6).optional(),
});

export type TCreateCampaignBody = z.infer<typeof postCreateCampaignBodySchema>;
export type TUpdateCampaignBody = z.infer<typeof putUpdateCampaignBodySchema>;
export type TCreateCampaignPublishmentBody = z.infer<typeof postCreateCampaignPublishmentBodySchema>;
export type TPostCampaignBuyBody = z.infer<typeof postCampaignBuyBodySchema>;
export type TUpdateCampaignJournalHighlightBody = z.infer<typeof patchUpdateCampaignJournalHighlightBodySchema>;
export type TAddCampaignPlayersQuery = z.infer<typeof postAddCampaignPlayersQuerySchema>;
export type TUpdateCampaignMatchMapImagesBody = z.infer<typeof patchUpdateCampaignMatchMapImagesBodySchema>;
export type TUpdateCampaignMatchImagesBody = z.infer<typeof patchUpdateCampaignMatchImagesBodySchema>;
export type THighlightCampaignMatchImageQuery = z.infer<typeof patchHighlightCampaignMatchImageQuerySchema>;
export type TAddCampaignMatchMusicsBody = z.infer<typeof patchAddCampaignMatchMusicsBodySchema>;
export type TRemoveCampaignMatchMusicBody = z.infer<typeof patchRemoveCampaignMatchMusicBodySchema>;
export type TEditCampaignMatchMusicBody = z.infer<typeof patchEditCampaignMatchMusicBodySchema>;
export type TUpdateCampaignPlayerCharacterQuery = z.infer<typeof patchUpdateCampaignPlayerCharacterQuerySchema>;
export type TConfirmCampaignPlayerQuery = z.infer<typeof patchConfirmCampaignPlayerQuerySchema>;
export type TTransferDungeonMasterQuery = z.infer<typeof patchTransferDungeonMasterQuerySchema>;
export type TUpdateCampaignCoverBodySchema = z.infer<typeof patchUpdateCampaignCoverBodySchema>;
export type TRemoveCampaignMatchMapImageQuery = z.infer<typeof patchRemoveCampaignMatchMapImageQuerySchema>;
export type TGetAllCampaignsQuery = z.infer<typeof getAllCampaignsQuerySchema>;
export type TConfirmPlayerPresenceQuery = z.infer<typeof postConfirmPlayerPresenceQuerySchema>;
export type TUpdateCampaignJournalPostQuery = z.infer<typeof patchUpdateCampaignJournalPostQuerySchema>;
export type TUpdateCampaignJournalPostBody = z.infer<typeof patchUpdateCampaignJournalPostBodySchema>;
export type TDeleteCampaignJournalPostQuery = z.infer<typeof patchDeleteCampaignJournalPostQuerySchema>;
export type TUpdateCampaignPlayerNoteQuery = z.infer<typeof patchUpdateCampaignPlayerNoteQuerySchema>;
export type TUpdateCampaignPlayerNoteBody = z.infer<typeof patchUpdateCampaignPlayerNoteBodySchema>;
export type TRemoveCampaignPlayerNoteQuery = z.infer<typeof patchRemoveCampaignPlayerNoteQuerySchema>;

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
    postRemoveCampaignPlayers: {
        query: postRemoveCampaignPlayersQuerySchema,
    },
    postCreateCampaignPublishment: {
        body: postCreateCampaignPublishmentBodySchema,
    },
    postCampaignBuy: {
        body: postCampaignBuyBodySchema,
    },
    patchUpdateCampaignMatchMapImages: {
        body: patchUpdateCampaignMatchMapImagesBodySchema,
    },
    patchUpdateCampaignMatchImages: {
        body: patchUpdateCampaignMatchImagesBodySchema,
    },
    patchHighlightCampaignMatchImage: {
        query: patchHighlightCampaignMatchImageQuerySchema,
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
    patchUpdateCampaignPlayerNote: {
        query: patchUpdateCampaignPlayerNoteQuerySchema,
        body: patchUpdateCampaignPlayerNoteBodySchema,
    },
    patchRemoveCampaignPlayerNote: {
        query: patchRemoveCampaignPlayerNoteQuerySchema,
    },
});
