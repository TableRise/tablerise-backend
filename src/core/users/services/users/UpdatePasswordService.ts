import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdatePasswordPayload } from 'src/types/api/users/http/payload';
import { UserPassword } from 'src/types/modules/core/users/users/UpdatePassword';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import StateMachine from 'src/domains/users/StateMachine';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

const status = InProgressStatusEnum.enum;

export default class UpdatePasswordService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        logger,
    }: UserCoreDependencies['updatePasswordServiceContract']) {
        this._usersRepository = usersRepository;
        this._logger = logger;
    }

    private async _changePassword({
        user,
        password,
    }: UserPassword): Promise<UserInstance> {
        this._logger('info', 'ChangePassword - UpdatePasswordService');

        user.password = await SecurePasswordHandler.hashPassword(password);
        user.inProgress.status = StateMachine('updatePassword', user.inProgress.status);

        return user;
    }

    public async update({ email, password }: UpdatePasswordPayload): Promise<void> {
        this._logger('info', 'Update - UpdatePasswordService');
        const userInDb = await this._usersRepository.findOne({ email });

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_PASSWORD_CHANGE)
            HttpRequestErrors.throwError('invalid-user-status');

        const passwordChanged = await this._changePassword({ user: userInDb, password });

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: passwordChanged,
        });
    }
}
