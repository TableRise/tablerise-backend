import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { CreateCampaignResponse } from 'src/types/api/campaigns/http/response';
import { CreateCampaignPayload } from 'src/types/api/campaigns/http/payload';

export default class CreateCampaignOperation {
    private readonly createCampaignService;
    private readonly logger;

    constructor({ createCampaignService, logger }: CampaignCoreDependencies['createCampaignOperationContract']) {
        this.createCampaignService = createCampaignService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        campaign,
        userId,
        image,
        mapImages,
        imageObject,
    }: CreateCampaignPayload): Promise<CreateCampaignResponse> {
        this.logger('info', 'Execute - CreateCampaignOperation');
        const entitySerialized = await this.createCampaignService.serialize({
            ...campaign,
        });

        const entityEnriched = await this.createCampaignService.enrichment(
            entitySerialized,
            userId,
            image,
            mapImages,
            imageObject
        );

        return this.createCampaignService.save(entityEnriched);
    }
}
