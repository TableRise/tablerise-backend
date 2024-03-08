import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';

export default class CampaignsRepository {
    private readonly _model;
    private readonly _serializer;
    private readonly _logger;

    constructor({
        database,
        serializer,
        logger,
    }: InfraDependencies['campaignsRepositoryContract']) {
        this._model = database.modelInstance('campaign', 'Campaigns');
        this._serializer = serializer;
        this._logger = logger;
    }

    private _formatAndSerializeData(data: CampaignInstance): CampaignInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this._serializer.postCampaign(format);
    }

    public async findOne(query: any = {}): Promise<CampaignInstance> {
        this._logger('info', 'FindOne - CampaignsRepository');
        const request = await this._model.findOne(query);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        return this._formatAndSerializeData(request);
    }
}
