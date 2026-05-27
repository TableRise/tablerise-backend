import Campaign, { Journal } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { systemsEnum } from 'src/domains/common/enums/systemsEnum';
import { campaignVisibilityEnum } from 'src/domains/campaigns/enums/campaignVisibilityEnum';
import { FileObject } from 'src/types/shared/file';

export type CampaignJournalCategory =
    | 'master'
    | 'admin'
    | 'players'
    | 'characters-players'
    | 'characters-master'
    | 'environment'
    | 'world-news'
    | 'announcements';

export type CampaignJournalPost = Journal & { postId: string };

export interface CampaignPayload {
    title: string;
    cover?: cover | string;
    description: string;
    visibility?: campaignVisibilityEnum.values;
    system: systemsEnum.values;
    musics: Campaign['musics'] | string;
    nextMatchDate?: string;
    lore: string;
    playerAmountLimit: string | number;
    ageRestriction: string | number;
    socialMedia?: Campaign['infos']['socialMedia'] | string;
    configurations: Campaign['configurations'];
    password?: string;
}

interface cover {
    id: string;
    link: string;
    uploadDate: string;
}

export interface CreateCampaignPayload {
    campaign: CampaignPayload;
    userId: string;
    image?: FileObject;
    mapImages?: FileObject[];
}

export interface GetCampaignByIdPayload {
    campaignId: string;
}

export interface GetAllCampaignsQuery {
    title?: string;
    code?: string;
}

export interface addCharacterPayload {
    campaignId: string;
    characterId: string;
}

export interface publishmentPayload {
    campaignId: string;
    userId: string;
    payload: {
        title: string;
        content: string;
        category: CampaignJournalCategory;
    };
}

export interface PostCampaignLogPayload {
    campaignId: string;
    userId: string;
    payload: Campaign['matchData']['logs'][number];
}

export interface PostCampaignBuyPayload {
    campaignId: string;
    userId: string;
    payload: Campaign['buys'][number];
}

export interface UpdateMatchMapImagesPayload {
    campaignId: string;
    mapImage?: FileObject;
    imageId?: string;
}

export interface UpdateMatchImagesPayload {
    campaignId: string;
    images?: FileObject[];
}

export interface UpdateMatchHighlightedImagePayload {
    campaignId: string;
    imageId?: string;
    remove?: boolean;
}

export interface AddMatchMusicPayload {
    campaignId: string;
    id: string;
    title: string;
    thumbnail: string;
}

export interface RemoveMatchMusicPayload {
    campaignId: string;
    id: string;
}

export interface EditMatchMusicPayload {
    campaignId: string;
    id: string;
    title: string;
    thumbnail: string;
}

export interface AddMatchDatePayload {
    campaignId: string;
    date: string;
}

export interface RemoveMatchDatePayload {
    campaignId: string;
}

export interface AddCampaignPlayersPayload {
    campaignId: string;
    userId: string;
    password: string;
}

export interface RemoveCampaignPlayersPayload {
    campaignId: string;
    userId: string;
}

export interface CheckCharactersPayload {
    userId: string;
    characterId: string;
}

export interface RemoveCampaignCoverPayload {
    campaignId: string;
}

export interface RemoveMatchMapImagePayload {
    campaignId: string;
    imageUrl: string;
}

export type HighlightedJournalPayload = CampaignJournalPost | Record<string, never>;

export interface UpdateCampaignJournalHighlightPayload {
    campaignId: string;
    userId: string;
    toggle: 'on' | 'off';
    post?: CampaignJournalPost;
}

export interface UpdateCampaignJournalPostPayload {
    campaignId: string;
    callerId: string;
    userId: string;
    postId: string;
    title: string;
    post: string;
    category: CampaignJournalCategory;
}

export interface DeleteCampaignJournalPostPayload {
    campaignId: string;
    callerId: string;
    userId: string;
    postId: string;
}

export interface UpdateCampaignPlayerNotePayload {
    campaignId: string;
    userId: string;
    title: string;
    content: string;
}

export interface RemoveCampaignPlayerNotePayload {
    campaignId: string;
    userId: string;
    title: string;
}
