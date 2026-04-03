import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UpdateObj } from 'src/types/shared/repository';

export default class CampaignsRepository {
    private readonly model;
    private readonly serializer;
    private readonly updateTimestampRepository;
    private readonly logger;

    constructor({
        updateTimestampRepository,
        database,
        serializer,
        logger,
    }: InfraDependencies['campaignsRepositoryContract']) {
        this.model = database.modelInstance('campaign', 'Campaigns');
        this.updateTimestampRepository = updateTimestampRepository;
        this.serializer = serializer;
        this.logger = logger;
    }

    private formatAndSerializeData(data: Campaign): Campaign {
        const format = JSON.parse(JSON.stringify(data));
        return this.serializer.postCampaign(format);
    }

    public async create(payload: Campaign): Promise<Campaign> {
        this.logger('warn', `Create - CampaignsRepository`);

        payload.campaignId = newUUID();

        const request = await this.model.create(payload);
        return this.formatAndSerializeData(request);
    }

    public async findOne(query: any = {}): Promise<Campaign> {
        this.logger('warn', 'FindOne - CampaignsRepository');
        const request = await this.model.findOne(query);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        return this.formatAndSerializeData(request);
    }

    public async find(query: any = {}): Promise<Campaign[]> {
        this.logger('warn', `Find - CampaignsRepository`);
        const request = await this.model.findAll(query);

        return request.map((data) => this.formatAndSerializeData(data));
    }

    public async update({ query, payload }: UpdateObj): Promise<Campaign> {
        this.logger('warn', 'Update - CampaignsRepository');

        const request = await this.model.update(query, payload);

        if (!request) HttpRequestErrors.throwError('campaign-inexistent');

        await this.updateTimestampRepository.updateTimestamp(query);

        return this.formatAndSerializeData(request);
    }
}
