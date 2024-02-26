import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdatePasswordPayload } from 'src/types/api/users/http/payload';
import { UserPassword } from 'src/types/modules/core/users/users/UpdatePassword';

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

    private async _changePassword({ user, password }: UserPassword): Promise<UserInstance> {
        this._logger('info', 'ChangePassword - UpdatePasswordService');

        user.password = await SecurePasswordHandler.hashPassword(password);
        user.inProgress.status = 'done';

        return user;
    }

    public async update({ email, code, password }: UpdatePasswordPayload): Promise<void> {
        this._logger('info', 'Update - UpdatePasswordService');
        const userInDb = await this._usersRepository.findOne({ email });

        if (userInDb.inProgress.status !== 'wait_to_verify')
            HttpRequestErrors.throwError('invalid-user-status');

        if (userInDb.inProgress.code !== code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        const passwordChanged = await this._changePassword({ user: userInDb, password });

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: passwordChanged,
        });
    }
}
