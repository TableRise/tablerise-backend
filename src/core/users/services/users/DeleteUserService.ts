import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
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
        this._changeInProgresStatusToDelete.bind(this);
    }

    private _changeInProgresStatusToDelete(user: UserInstance): UserInstance {
        this._logger(
            'info',
            `ChangeInProgesStatusToDelete - User InProgress Status change to wait_to_delete`
        );
        user.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;
        return user;
    }

    public async delete(userId: string): Promise<void> {
        this._logger('info', `Delete - DeleteUserService - ReceivedID is ${userId}`);
        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userInDb || !userDetailInDb) HttpRequestErrors.throwError('user-inexistent');
        if (
            userDetailInDb.gameInfo.campaigns.length ||
            userDetailInDb.gameInfo.characters.length
        ) {
            HttpRequestErrors.throwError('linked-mandatory-data-when-delete');
        }

        let userUpdated = this._changeInProgresStatusToDelete(userInDb);
        userUpdated = await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userUpdated,
        });

        this._logger(
            'info',
            `Delete Service - User waiting to be deleted from database with ID ${userUpdated.userId} and status ${userUpdated.inProgress.status}`
        );
    }
}
