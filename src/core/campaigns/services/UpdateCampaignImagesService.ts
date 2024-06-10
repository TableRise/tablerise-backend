import {
    CharactersCampaign,
    ImageObject,
} from '@tablerise/database-management/dist/src/interfaces/Campaigns';
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
            image && (await this._imageStorageClient.upload(image));

        if (operation === 'add' && imageUploadResponse) {
            if (name) {
                campaign.images.characters.push({
                    imageId: imageUploadResponse.data.id,
                    name,
                    link: imageUploadResponse.data.link,
                    uploadDate: new Date().toISOString(),
                });
            } else {
                campaign.images.maps.push({
                    id: imageUploadResponse.data.id,
                    link: imageUploadResponse.data.link,
                    uploadDate: new Date().toISOString(),
                });
            }
        }

        if (operation === 'remove' && campaign.images) {
            if (name) {
                campaign.images.characters = campaign.images.characters.filter(
                    (characterImage: CharactersCampaign) =>
                        characterImage.imageId !== imageId
                );
            } else {
                campaign.images.maps = campaign.images.maps.filter(
                    (mapImage: ImageObject) => mapImage.id !== imageId
                );
            }
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
