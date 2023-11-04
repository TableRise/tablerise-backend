import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { UpdateTimestampRepositoryContract } from 'src/types/users/contracts/repositories/UpdateTimestampRepository';
import { UpdateTimestampPayload } from 'src/types/users/requests/Payload';

export default class UpdateTimestampRepository {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({ usersDetailsRepository, usersRepository, logger }: UpdateTimestampRepositoryContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;
    }

    public async updateTimestamp(query: UpdateTimestampPayload): Promise<void> {
        this._logger('info', 'UpdateTimestamp - UpdateTimestampRepository');
        if (query.userId) {
            const userInDb = await this._usersRepository.findOne(query);

            userInDb.updatedAt = new Date().toISOString();

            await this._usersRepository.update({
                query: { userId: userInDb.userId },
                payload: userInDb
            });
        }

        if (query.userDetailId) {
            const userDetailInDb = await this._usersDetailsRepository.findOne(query);
            const userInDb = await this._usersRepository.findOne({ userId: userDetailInDb.userId });

            userInDb.updatedAt = new Date().toISOString();

            await this._usersRepository.update({
                query: { userId: userInDb.userId },
                payload: userInDb
            });
        }

        throw new HttpRequestErrors({
            message: 'Query not valid or missing to update user timestamp',
            code: HttpStatusCode.BAD_REQUEST,
            name: 'QueryInvalid'
        });
    }
}
