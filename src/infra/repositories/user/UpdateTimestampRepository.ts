import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { UpdateTimestampRepositoryContract } from 'src/types/users/contracts/repositories/UpdateTimestampRepository';
import { UpdateTimestampPayload } from 'src/types/users/requests/Payload';

export default class UpdateTimestampRepository {
    private readonly _usersModel;
    private readonly _usersDetailsModel;
    private readonly _logger;

    constructor({ database, logger }: UpdateTimestampRepositoryContract) {
        this._usersModel = database.modelInstance('user', 'Users');
        this._usersDetailsModel = database.modelInstance('user', 'UserDetails');
        this._logger = logger;
    }

    public async updateTimestamp(query: UpdateTimestampPayload): Promise<void> {
        this._logger('info', 'UpdateTimestamp - UpdateTimestampRepository');
        if (query.userId) {
            const userInDb = await this._usersModel.findOne(query);

            userInDb.updatedAt = new Date().toISOString();

            await this._usersModel.update({ userId: userInDb.userId }, userInDb);
        }

        if (query.userDetailId) {
            const userDetailInDb = await this._usersDetailsModel.findOne(query);
            const userInDb = await this._usersModel.findOne({ userId: userDetailInDb.userId });

            userInDb.updatedAt = new Date().toISOString();

            await this._usersDetailsModel.update({ userId: userInDb.userId }, userInDb);
        }

        throw new HttpRequestErrors({
            message: 'Query not valid or missing to update user timestamp',
            code: HttpStatusCode.BAD_REQUEST,
            name: 'QueryInvalid'
        });
    }
}
