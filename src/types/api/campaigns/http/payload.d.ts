import { systemsEnum } from 'src/domains/common/enums/systemsEnum';
import { campaignVisibilityEnum } from 'src/domains/campaigns/enums/campaignVisibilityEnum';
import { FileObject } from 'src/types/shared/file';

export interface CampaignPayload {
    title: string;
    cover?: cover | string;
    description: string;
    visibility?: campaignVisibilityEnum.values;
    system: systemsEnum.values;
    ageRestriction: string | number;
    password: string;
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
}

export interface GetCampaignByIdPayload {
    campaignId: string;
}

export interface addCharacterPayload {
    campaignId: string;
    userId: string;
    charcaterId: string;
}

export interface publishmentPayload {
    campaignId: string;
    userId: string;
    payload: {
        title: string;
        content: string;
    };
}

export interface UpdateMatchMapImagesPayload {
    campaignId: string;
    mapImage?: FileObject;
    imageId?: string;
    operation: 'add' | 'remove';
}

export interface UpdateMatchMusicsPayload {
    campaignId: string;
    youtubeLink: string;
    title: string;
    operation: 'add' | 'remove';
}

export interface UpdateMatchDatesPayload {
    campaignId: string;
    date: string;
    operation: 'add' | 'remove';
}

export interface AddMatchPlayersPayload {
    campaignId: string;
    userId: string;
    characterId?: string;
    password: string;
}

export interface RemoveMatchPlayersPayload {
    campaignId: string;
    userId: string;
}

export interface CheckCharactersPayload {
    userId: string;
    characterId: string;
}

export interface PostInvitationEmailPayload {
    campaignId: string;
    userId: string;
    targetEmail: string;
    username: string;
}

export interface PostBanPlayerPayload {
    campaignId: string;
    playerId: string;
}

export interface UpdateCampaignImagesPayload {
    campaignId: string;
    image?: FileObject;
    name?: string;
    imageId?: string;
    operation: 'add' | 'remove';
}
