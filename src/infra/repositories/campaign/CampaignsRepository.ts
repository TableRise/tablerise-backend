import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class CampaignsRepository {
    private readonly _model;
    private readonly _updateTimestampRepository;
    private readonly _campaignsSerializer;
    private readonly _logger;

    constructor({
        updateTimestampRepository,
        database,
        campaignsSerializer,
        logger,
    }: InfraDependencies['campaignsRepositoryContract']) {
        this._updateTimestampRepository = updateTimestampRepository;
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
        console.log(payload);
        const request = await this._model.create(payload);
        return this._formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<CampaignInstance[]> {
        this._logger('info', `Find - CampaignsRepository`);
        const request = await this._model.findAll(query);

        return request.map((entity: CampaignInstance) =>
            this._formatAndSerializeData(entity)
        );
    }

    public async findOne(query: any = {}): Promise<CampaignInstance> {
        this._logger('info', 'FindOne - CampaignsRepository');
        const request = await this._model.findOne(query);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        return this._formatAndSerializeData(request);
    }

    public async update({ query, payload }: UpdateObj): Promise<CampaignInstance> {
        this._logger('info', 'Update - CampaignsRepository');

        const request = await this._model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        await this._updateTimestampRepository.updateTimestamp(query);

        return this._formatAndSerializeData(request);
    }

    public async delete(query: any): Promise<void> {
        this._logger('warn', 'Delete - CampaignsRepository');
        await this._model.delete(query);
    }
}
