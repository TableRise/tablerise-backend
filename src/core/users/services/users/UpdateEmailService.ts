import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import {
    UpdateEmailServiceContract,
    UserEmail,
} from 'src/types/contracts/users/UpdateEmail';
import { UpdateEmailPayload } from 'src/types/requests/Payload';

export default class UpdateEmailService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: UpdateEmailServiceContract) {
        this._usersRepository = usersRepository;
        this._logger = logger;
    }

    private _changeEmail({ user, email }: UserEmail): UserInstance {
        this._logger('info', 'ChangeEmail - UpdateEmailService');

        user.email = email;
        user.inProgress.status = 'done';
        user.updatedAt = new Date().toISOString();

        return user;
    }

    public async update({ userId, code, email }: UpdateEmailPayload): Promise<void> {
        this._logger('info', 'Update - UpdateEmailService');
        const userInDb = await this._usersRepository.findOne({ userId });

        if (userInDb.inProgress.status !== 'wait_to_verify')
            HttpRequestErrors.throwError('invalid-user-status');

        if (userInDb.inProgress.code !== code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        const emailAlreadyExist = await this._usersRepository.findOne({ email });

        if (emailAlreadyExist) HttpRequestErrors.throwError('email-already-exist');

        const emailChanged = this._changeEmail({ user: userInDb, email });

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: emailChanged,
        });
    }
}
