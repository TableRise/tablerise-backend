import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';

export default class CampaignsRepository {
    private readonly _model;
    private readonly _serializer;
    private readonly _updateTimestampRepository;
    private readonly _logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['campaignsRepositoryContract']) {
        this._model = database.modelInstance('campaign', 'Campaigns');
        this._updateTimestampRepository = updateTimestampRepository;
        this._serializer = serializer;
        this._logger = logger;
    }

    private _formatAndSerializeData(data: CampaignInstance): CampaignInstance {
        const format = JSON.parse(JSON.stringify(data));
        return this._serializer.postCampaign(format);
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

    public async update({ query, payload }: UpdateObj): Promise<CampaignInstance> {
        this._logger('info', 'Update - UsersRepository');

        const request = await this._model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        await this._updateTimestampRepository.updateTimestamp(query);

        return this._formatAndSerializeData(request);
    }
}
