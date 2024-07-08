import { CampaignUpdatePayload } from 'src/domains/campaigns/schemas/campaignsUpdateValidationSchema';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignService {
    private readonly _campaignsRepository;
    private readonly _imageStorageClient;
    private readonly _logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateCampaignServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;

        this.update = this.update.bind(this);
    }

    async update({
        campaignId,
        title,
        description,
        visibility,
        cover,
    }: CampaignUpdatePayload): Promise<CampaignInstance> {
        this._logger('info', 'Update - UpdateCampaignService');
        const campaignInDb = await this._campaignsRepository.findOne({ campaignId });

        campaignInDb.title = title ?? campaignInDb.title;
        campaignInDb.description = description ?? campaignInDb.description;
        campaignInDb.infos.visibility =
            (visibility as 'hidden' | 'visible') ?? campaignInDb.infos.visibility;

        if (cover) campaignInDb.cover = await this._imageStorageClient.upload(cover);

        return campaignInDb;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        this._logger('info', 'Save - UpdateCampaignService');
        const savedCampaign = await this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        return savedCampaign;
    }
}
