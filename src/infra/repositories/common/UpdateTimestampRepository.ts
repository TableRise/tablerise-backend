import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { UpdateTimestampPayload } from 'src/types/api/users/methods';

export default class UpdateTimestampRepository {
    private readonly usersModel;
    private readonly usersDetailsModel;
    private readonly campaignsModel;
    private readonly charactersModel;
    private readonly logger;

    constructor({ database, logger }: InfraDependencies['updateTimestampRepositoryContract']) {
        this.usersModel = database.modelInstance('user', 'Users');
        this.usersDetailsModel = database.modelInstance('user', 'UserDetails');
        this.campaignsModel = database.modelInstance('campaign', 'Campaigns');
        this.charactersModel = database.modelInstance('characterDnd', 'CharactersDnd');

        this.logger = logger;
    }

    public async updateTimestamp(query: UpdateTimestampPayload): Promise<void> {
        this.logger('info', 'UpdateTimestamp - UpdateTimestampRepository');

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

        await updateMethods[Object.keys(query)[0] as keyof UpdateTimestampPayload].call(this, query);
    }

    public async updateToUserId(query: UpdateTimestampPayload): Promise<void> {
        const userInDb = await this.usersModel.findOne(query);

        userInDb.updatedAt = new Date().toISOString();

        await this.usersModel.update({ userId: userInDb.userId }, userInDb);
    }

    public async updateToUserDetail(query: UpdateTimestampPayload): Promise<void> {
        const userDetailInDb = await this.usersDetailsModel.findOne(query);
        const userInDb = await this.usersModel.findOne({
            userId: userDetailInDb.userId,
        });

        userInDb.updatedAt = new Date().toISOString();

        await this.usersModel.update({ userId: userInDb.userId }, userInDb);
    }

    public async updateToCampaignId(query: UpdateTimestampPayload): Promise<void> {
        const campaignInDb = await this.campaignsModel.findOne(query);

        campaignInDb.updatedAt = new Date().toISOString();

        await this.campaignsModel.update({ campaignId: campaignInDb.campaignId }, campaignInDb);
    }

    public async updateToCharacterId(query: UpdateTimestampPayload): Promise<void> {
        const characterInDb = await this.charactersModel.findOne(query);

        characterInDb.updatedAt = new Date().toISOString();

        await this.charactersModel.update({ characterId: characterInDb.characterId }, characterInDb);
    }
}
