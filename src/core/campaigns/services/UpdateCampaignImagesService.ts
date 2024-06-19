import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { UpdateCampaignImagesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignImagesService {
    private readonly _campaignsRepository;
    private readonly _imageStorageClient;
    private readonly _logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateCampaignImagesServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;
    }

    addCampaignImage(
        campaign: CampaignInstance,
        imageUploadResponse: ImageObject,
        name: string | undefined
    ): CampaignInstance {
        this._logger('info', 'AddCampaignImage - UpdateCampaignImagesService');
        if (name) {
            campaign.images.characters.push(imageUploadResponse);
        } else {
            campaign.images.maps.push(imageUploadResponse);
        }
        return campaign;
    }

    removeCampaignImage(
        campaign: CampaignInstance,
        name: string | undefined,
        imageId: string | undefined
    ): CampaignInstance {
        this._logger('info', 'RemoveCampaignImage - UpdateCampaignImagesService');
        if (name) {
            campaign.images.characters = campaign.images.characters.filter(
                (characterImage: ImageObject) => characterImage.id !== imageId
            );
        } else {
            campaign.images.maps = campaign.images.maps.filter(
                (mapImage: ImageObject) => mapImage.id !== imageId
            );
        }
        return campaign;
    }

    async updateCampaignImage({
        campaignId,
        image,
        name,
        operation,
        imageId,
    }: UpdateCampaignImagesPayload): Promise<CampaignInstance> {
        this._logger('info', 'UpdateCampaignImage - UpdateCampaignImagesService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });
        const imageUploadResponse =
            image && (await this._imageStorageClient.upload(image, name));

        if (operation === 'add' && imageUploadResponse) {
            this.addCampaignImage(campaign, imageUploadResponse, name);
        }

        if (operation === 'remove' && campaign.images) {
            this.removeCampaignImage(campaign, name, imageId);
        }

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        this._logger('info', 'Save - UpdateCampaignImagesService');
        const savedCampaign = await this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        return savedCampaign;
    }
}
