import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UpdateCampaignImagesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

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

    addCampaignImage(
        campaign: Campaign,
        imageUploadResponse: ImageObject,
        name: string | undefined
    ): Campaign {
        this.logger('info', 'AddCampaignImage - UpdateCampaignImagesService');
        if (name) {
            campaign.images.characters.push(imageUploadResponse);
        } else {
            campaign.images.maps.push(imageUploadResponse);
        }
        return campaign;
    }

    removeCampaignImage(
        campaign: Campaign,
        name: string | undefined,
        imageId: string | undefined
    ): Campaign {
        this.logger('info', 'RemoveCampaignImage - UpdateCampaignImagesService');
        if (name) {
            campaign.images.characters = campaign.images.characters.filter(
                (characterImage: ImageObject) => characterImage.id !== imageId
            );
        } else {
            campaign.images.maps = campaign.images.maps.filter((mapImage: ImageObject) => mapImage.id !== imageId);
        }
        return campaign;
    }

    async updateCampaignImage({
        campaignId,
        image,
        name,
        operation,
        imageId,
    }: UpdateCampaignImagesPayload): Promise<Campaign> {
        this.logger('info', 'UpdateCampaignImage - UpdateCampaignImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const imageUploadResponse = image && (await this.imageStorageClient.upload(image, name));

        if (operation === 'add' && imageUploadResponse) {
            this.addCampaignImage(campaign, imageUploadResponse, name);
        }

        if (operation === 'remove' && campaign.images) {
            this.removeCampaignImage(campaign, name, imageId);
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
