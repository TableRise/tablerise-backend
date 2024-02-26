import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { UpdateTimestampPayload } from 'src/types/api/users/methods';

export default class UpdateTimestampRepository {
    private readonly _usersModel;
    private readonly _usersDetailsModel;
    private readonly _logger;

    constructor({ database, logger }: InfraDependencies['updateTimestampRepositoryContract']) {
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
            return;
        }

        if (query.userDetailId) {
            const userDetailInDb = await this._usersDetailsModel.findOne(query);
            const userInDb = await this._usersModel.findOne({
                userId: userDetailInDb.userId,
            });

            userInDb.updatedAt = new Date().toISOString();

            await this._usersModel.update({ userId: userInDb.userId }, userInDb);
            return;
        }

        throw new HttpRequestErrors({
            message: 'Query not valid or missing to update user timestamp',
            code: HttpStatusCode.BAD_REQUEST,
            name: 'BadRequest',
        });
    }
}
