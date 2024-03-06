import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { UpdateTimestampPayload } from 'src/types/api/campaigns/methods';

export default class UpdateTimestampRepository {
    private readonly _campaignsModel;
    private readonly _logger;

    constructor({
        database,
        logger,
    }: InfraDependencies['updateTimestampRepositoryContract']) {
        this._campaignsModel = database.modelInstance('campaign', 'Campaigns');
        this._logger = logger;
    }

    public async updateTimestamp(query: UpdateTimestampPayload): Promise<void> {
        this._logger('info', 'UpdateTimestamp - UpdateTimestampRepository');
        if (query.campaignId) {
            const campaignInDb = await this._campaignsModel.findOne(query);

            campaignInDb.updatedAt = new Date().toISOString();

            await this._campaignsModel.update(
                { campaignId: campaignInDb.campaignId },
                campaignInDb
            );
            return;
        }

        throw new HttpRequestErrors({
            message: 'Query not valid or missing to update campaign timestamp',
            code: HttpStatusCode.BAD_REQUEST,
            name: 'BadRequest',
        });
    }
}
