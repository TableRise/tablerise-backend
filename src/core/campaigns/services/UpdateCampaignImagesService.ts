import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { TUpdateCampaignImagesBodySchema } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import { FileObject } from 'src/types/shared/file';

export default class UpdateCampaignImagesService {
    private readonly campaignsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateCampaignImagesServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    addCampaignImage(campaign: Campaign, imageUploadResponse: ImageObject): Campaign {
        this.logger('info', 'AddCampaignImage - UpdateCampaignImagesService');
        campaign.images.maps.push(imageUploadResponse);
        return campaign;
    }

    removeCampaignImage(campaign: Campaign, imageId: string | undefined): Campaign {
        this.logger('info', 'RemoveCampaignImage - UpdateCampaignImagesService');
        campaign.images.maps = campaign.images.maps.filter((mapImage: ImageObject) => mapImage.id !== imageId);
        return campaign;
    }

    async updateCampaignImage({
        campaignId,
        operation,
        picture,
        imageId,
    }: TUpdateCampaignImagesBodySchema & { campaignId: string }): Promise<Campaign> {
        this.logger('info', 'UpdateCampaignImage - UpdateCampaignImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const imageUploadResponse = picture && (await this.imageStorageClient.upload(picture as unknown as FileObject));

        if (operation === 'add' && imageUploadResponse) {
            this.addCampaignImage(campaign, imageUploadResponse);
        }

        if (operation === 'remove' && campaign.images) {
            this.removeCampaignImage(campaign, imageId);
        }

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - UpdateCampaignImagesService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
