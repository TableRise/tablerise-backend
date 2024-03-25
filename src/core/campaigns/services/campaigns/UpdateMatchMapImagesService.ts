import { CampaignInstance } from "src/domains/campaigns/schemas/campaignsValidationSchema";
import { UpdateMatchMapImagesPayload } from "src/types/api/campaigns/http/payload";
import CampaignCoreDependencies from "src/types/modules/core/campaigns/CampaignCoreDependencies";

export default class UpdateMatchMapImagesService {
    private readonly _campaignsRepository;
    private readonly _imageStorageClient;
    private readonly _logger;

    constructor({ campaignsRepository, imageStorageClient, logger }: CampaignCoreDependencies['updateMatchMapImagesServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;
    }

    async updateMatchMapImage({ campaignId, mapImage, operation, imageId }: UpdateMatchMapImagesPayload): Promise<CampaignInstance> {
        this._logger('info', 'UpdateMatchMapImage - UpdateMatchMapImagesService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });
        const imageUploadResponse = await this._imageStorageClient.upload(mapImage);

        if (operation === 'add') campaign.matchData.mapImages.push({
            id: imageUploadResponse.data.id,
            link: imageUploadResponse.data.link,
            uploadDate: new Date().toISOString()
        });

        if (operation === 'remove') campaign.matchData.mapImages = campaign.matchData.mapImages
            .filter((mapImage) => mapImage.id !== imageId);

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        const savedCampaign = await this._campaignsRepository.update({
            query: { campaign: campaign.campaignId },
            payload: campaign
        });

        return savedCampaign;
    }
}