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
