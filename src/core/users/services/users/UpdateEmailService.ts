import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateEmailPayload } from 'src/types/api/users/http/payload';
import { UserEmail } from 'src/types/modules/core/users/users/UpdateEmail';

export default class UpdateEmailService {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        logger,
    }: UserCoreDependencies['updateEmailServiceContract']) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.update = this.update.bind(this);
    }

    private _changeEmail({ user, email }: UserEmail): UserInstance {
        this._logger('info', 'ChangeEmail - UpdateEmailService');
        user.email = email;
        user.inProgress.status = 'done';
        return user;
    }

    public async update({ userId, email }: UpdateEmailPayload): Promise<void> {
        this._logger('info', 'Update - UpdateEmailService');
        const userInDb = await this._usersRepository.findOne({ userId });

        const emailAlreadyExist = await this._usersRepository.find({ email });

        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email-already-exist');

        const emailChanged = this._changeEmail({ user: userInDb, email });

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: emailChanged,
        });
    }
}
