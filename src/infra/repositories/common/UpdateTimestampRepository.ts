import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { UpdateTimestampPayload } from 'src/types/api/users/methods';

export default class UpdateTimestampRepository {
    private readonly _usersModel;
    private readonly _usersDetailsModel;
    private readonly _campaignsModel;
    private readonly _charactersModel;
    private readonly _logger;

    constructor({
        database,
        logger,
    }: InfraDependencies['updateTimestampRepositoryContract']) {
        this._usersModel = database.modelInstance('user', 'Users');
        this._usersDetailsModel = database.modelInstance('user', 'UserDetails');
        this._campaignsModel = database.modelInstance('campaign', 'Campaigns');
        this._charactersModel = database.modelInstance('characterDnd', 'CharactersDnd');

        this._logger = logger;
    }

    public async updateTimestamp(query: UpdateTimestampPayload): Promise<void> {
        this._logger('info', 'UpdateTimestamp - UpdateTimestampRepository');

        const updateMethods = {
            userId: this.updateToUserId,
            userDetailId: this.updateToUserDetail,
            campaignId: this.updateToCampaignId,
            characterId: this.updateToCharacterId,
        };

        if (!Object.keys(query).length)
            throw new HttpRequestErrors({
                message: 'Query missing to update user timestamp',
                code: HttpStatusCode.BAD_REQUEST,
                name: 'BadRequest',
            });

        await updateMethods[Object.keys(query)[0] as keyof UpdateTimestampPayload].call(
            this,
            query
        );
    }

    public async updateToUserId(query: UpdateTimestampPayload): Promise<void> {
        const userInDb = await this._usersModel.findOne(query);

        userInDb.updatedAt = new Date().toISOString();

        await this._usersModel.update({ userId: userInDb.userId }, userInDb);
    }

    public async updateToUserDetail(query: UpdateTimestampPayload): Promise<void> {
        const userDetailInDb = await this._usersDetailsModel.findOne(query);
        const userInDb = await this._usersModel.findOne({
            userId: userDetailInDb.userId,
        });

        userInDb.updatedAt = new Date().toISOString();

        await this._usersModel.update({ userId: userInDb.userId }, userInDb);
    }

    public async updateToCampaignId(query: UpdateTimestampPayload): Promise<void> {
        const campaignInDb = await this._campaignsModel.findOne(query);

        campaignInDb.updatedAt = new Date().toISOString();

        await this._campaignsModel.update(
            { campaignId: campaignInDb.campaignId },
            campaignInDb
        );
    }

    public async updateToCharacterId(query: UpdateTimestampPayload): Promise<void> {
        const characterInDb = await this._charactersModel.findOne(query);

        characterInDb.updatedAt = new Date().toISOString();

        await this._charactersModel.update(
            { campaignId: characterInDb.characterId },
            characterInDb
        );
    }
}
