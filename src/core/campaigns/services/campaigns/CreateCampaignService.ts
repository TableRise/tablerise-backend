import {
    __FullCampaign,
    __CampaignEnriched,
    __CampaignSaved,
    __CampaignSerialized,
} from 'src/types/api/campaigns/methods';
import { CampaignPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';

export default class CreateCampaignService {
    private readonly _campaignsRepository;
    private readonly _serializer;
    private readonly _imageStorageClient;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
        serializer,
        imageStorageClient,
    }: CampaignCoreDependencies['createCampaignServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._serializer = serializer;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;

        this.enrichment = this.enrichment.bind(this);
        this.save = this.save.bind(this);
        this.serialize = this.serialize.bind(this);
    }

    public async serialize(campaign: CampaignPayload): Promise<__CampaignSerialized> {
        this._logger('info', 'Serialize - CreateCampaignService');
        const campaignSerialized = this._serializer.postCampaign(campaign);

        return campaignSerialized;
    }

    public async enrichment(
        campaign: __FullCampaign,
        userId: string,
        image?: FileObject
    ): Promise<__CampaignEnriched> {
        this._logger('info', 'Enrichment - CreateCampaignService');
        campaign.campaignPlayers = [
            {
                userId,
                characterIds: [],
                role: 'dungeon_master',
            },
        ];
        delete campaign.visibility;

        if (image) {
            const response = await this._imageStorageClient.upload(image);
            console.log(response);
            campaign.cover = {
                id: response.data.id,
                link: response.data.link,
                uploadDate: new Date().toISOString(),
            };
        }

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
