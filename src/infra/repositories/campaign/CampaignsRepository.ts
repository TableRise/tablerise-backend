import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';

export default class CampaignsRepository {
    private readonly _model;
    private readonly _campaignsSerializer;
    private readonly _logger;

    constructor({
        database,
        campaignsSerializer,
        logger,
    }: InfraDependencies['campaignsRepositoryContract']) {
        this._model = database.modelInstance('campaign', 'Campaigns');
        this._campaignsSerializer = campaignsSerializer;
        this._logger = logger;
    }

    private _formatAndSerializeData(data: CampaignInstance): CampaignInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this._campaignsSerializer.postCampaign(format);
    }

    public async create(payload: CampaignInstance): Promise<CampaignInstance> {
        this._logger('info', `Create - CampaignsRepository`);

        payload.campaignId = newUUID();
        const request = await this._model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async findOne(query: any = {}): Promise<CampaignInstance> {
        this._logger('info', 'FindOne - CampaignsRepository');
        const request = await this._model.findOne(query);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        return this._formatAndSerializeData(request);
    }
}
