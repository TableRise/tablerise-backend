import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SecurePasswordHandler from 'src/domains/user/helpers/SecurePasswordHandler';
import {
    UpdatePasswordServiceContract,
    UserPassword,
} from 'src/types/users/contracts/core/UpdatePassword';
import { UpdatePasswordPayload } from 'src/types/users/requests/Payload';

export default class UpdatePasswordService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: UpdatePasswordServiceContract) {
        this._usersRepository = usersRepository;
        this._logger = logger;
    }

    private async _changePassword({
        user,
        password,
    }: UserPassword): Promise<UserInstance> {
        this._logger('info', 'ChangePassword - UpdatePasswordService');

        user.password = await SecurePasswordHandler.hashPassword(password);
        user.inProgress.status = 'done';

        return user;
    }

    public async update({
        userId,
        code,
        password,
    }: UpdatePasswordPayload): Promise<void> {
        this._logger('info', 'Update - UpdatePasswordService');
        const userInDb = await this._usersRepository.findOne({ userId });

        if (userInDb.inProgress.status !== 'wait_to_verify')
            HttpRequestErrors.throwError('invalid-user-status');

        if (userInDb.inProgress.code !== code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        const emailChanged = this._changePassword({ user: userInDb, password });

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: emailChanged,
        });
    }
}