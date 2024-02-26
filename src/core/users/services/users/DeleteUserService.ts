import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class DeleteUserService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['deleteUserServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.delete = this.delete.bind(this);
    }

    public async delete(userId: string): Promise<void> {
        this._logger('info', `Delete - DeleteUserService - ReceivedID is ${userId}`);
        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userInDb || !userDetailInDb) HttpRequestErrors.throwError('user-inexistent');
        if (userDetailInDb.gameInfo.campaigns.length || userDetailInDb.gameInfo.characters.length) {
            HttpRequestErrors.throwError('linked-mandatory-data-when-delete');
        }

        await this._usersRepository.delete({ userId });
        await this._usersDetailsRepository.delete({ userId });

        this._logger('info', `Delete Service - User deleted from database with ID ${userId}`);
    }
}
