import { systemsEnum } from 'src/domains/common/enums/systemsEnum';
import { campaignVisibilityEnum } from 'src/domains/campaigns/enums/campaignVisibilityEnum';
import { FileObject } from 'src/types/shared/file';

export interface CampaignPayload {
    title: string;
    cover?: {
        id: string;
        link: string;
        uploadDate: string;
    };
    description: string;
    visibility?: campaignVisibilityEnum.values;
    system: systemsEnum.values;
    ageRestriction: number;
}

export interface CreateCampaignPayload {
    campaign: CampaignPayload;
    userId: string;
    image?: FileObject;
}

export interface GetCampaignByIdPayload {
    campaignId: string;
}

export interface UpdateMatchMapImagesPayload {
    campaignId: string;
    mapImage: FileObject;
    imageId?: string;
    operation: 'add' | 'remove';
}
