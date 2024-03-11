import {
    __FullCampaign,
    __CampaignEnriched,
    __CampaignSaved,
    __CampaignSerialized,
} from 'src/types/api/campaigns/methods';
import { CreateCampaignPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class CreateCampaignService {
    private readonly _campaignsRepository;
    private readonly _campaignsSerializer;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
        campaignsSerializer,
    }: CampaignCoreDependencies['createCampaignServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._campaignsSerializer = campaignsSerializer;
        this._logger = logger;

        this.enrichment = this.enrichment.bind(this);
        this.save = this.save.bind(this);
        this.serialize = this.serialize.bind(this);
    }

    public async serialize(
        campaign: CreateCampaignPayload
    ): Promise<__CampaignSerialized> {
        this._logger('info', 'Serialize - CreateCampaignService');
        const campaignSerialized = this._campaignsSerializer.postCampaign(campaign);

        return campaignSerialized;
    }

    public async enrichment(
        campaign: __FullCampaign,
        userId: string
    ): Promise<__CampaignEnriched> {
        this._logger('info', 'Enrichment - CreateCampaignService');

        campaign.campaignPlayers = [
            {
                userId,
                characterIds: [],
                role: 'dungeon-master',
            },
        ];
        campaign.createdAt = new Date().toISOString();
        campaign.updatedAt = new Date().toISOString();

        return campaign;
    }

    public async save(campaign: __FullCampaign): Promise<__CampaignSaved> {
        this._logger('info', 'Save - CreateCampaignService');

        const campaignSaved = await this._campaignsRepository.create({
            ...campaign,
        });

        return campaignSaved;
    }
}
