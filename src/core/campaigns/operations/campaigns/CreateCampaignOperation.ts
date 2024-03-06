import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { CreateCampaignResponse } from 'src/types/api/campaigns/http/response';
import { CreateCampaignPayload } from 'src/types/api/campaigns/http/payload';

export default class CreateCampaignOperation {
    private readonly _campaignsSchema;
    private readonly _schemaValidator;
    private readonly _createCampaignService;
    private readonly _logger;

    constructor({
        campaignsSchema,
        schemaValidator,
        createCampaignService,
        logger,
    }: CampaignCoreDependencies['createCampaignOperationContract']) {
        this._campaignsSchema = campaignsSchema;
        this._schemaValidator = schemaValidator;
        this._createCampaignService = createCampaignService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        payload: CreateCampaignPayload
    ): Promise<CreateCampaignResponse> {
        this._logger('info', 'Execute - CreateCampaignOperation');

        this._schemaValidator.entry(
            this._campaignsSchema.createCampaignsZodSchema,
            payload
        );

        this._logger('info', 'Passed - CreateCampaignOperation - SchemaValidator');

        const entitySerialized = await this._createCampaignService.serialize({
            ...payload,
        });

        const entityEnriched = await this._createCampaignService.enrichment(
            entitySerialized
        );

        const entitySaved = await this._createCampaignService.save(entityEnriched);

        return entitySaved;
    }
}
