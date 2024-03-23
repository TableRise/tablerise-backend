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

    async updateMatchMapImage({ campaignId, mapImage, operation }: UpdateMatchMapImagesPayload): Promise<CampaignInstance> {
        this._logger('info', 'UpdateMatchMapImage - UpdateMatchMapImagesService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });
        const imageUploadResponse = await this._imageStorageClient.upload(mapImage);

        campaign.matchData.mapImages
    }
}