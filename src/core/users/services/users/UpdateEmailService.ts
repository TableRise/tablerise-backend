import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateEmailPayload } from 'src/types/users/requests/Payload';
import { UserEmail } from 'src/types/modules/core/users/users/UpdateEmail';

export default class UpdateEmailService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({ usersRepository, logger }: UserCoreDependencies['updateEmailServiceContract']) {
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

        const emailAlreadyExist = await this._usersRepository.find({ email });

        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email-already-exist');

        const emailChanged = this._changeEmail({ user: userInDb, email });

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: emailChanged,
        });
    }
}
