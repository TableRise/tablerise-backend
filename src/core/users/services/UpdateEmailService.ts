import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { UpdateEmailServiceContract, UserEmail } from 'src/types/contracts/users/UpdateEmail';
import { UpdateEmailPayload } from 'src/types/requests/Payload';

export default class UpdateEmailService extends UpdateEmailServiceContract {
    constructor({ usersRepository, httpRequestErrors, logger }: UpdateEmailServiceContract) {
        super();
        this.usersRepository = usersRepository;
        this.httpRequestErrors = httpRequestErrors;
        this.logger = logger;
    }

    private _changeEmail({ user, email }: UserEmail): UserInstance {
        this.logger('info', '[ChangeEmail - UpdateEmailService]');
        
        user.email = email;
        user.inProgress.status = 'email_change';
        user.updatedAt = new Date().toISOString();

        return user;
    }

    public async update({ userId, code, email }: UpdateEmailPayload): Promise<void> {
        this.logger('info', '[Update - UpdateEmailService]');
        const userInDb = await this.usersRepository.findOne(userId);

        if (userInDb.inProgress.code !== code) {
            this.logger('error', 'Code is invalid - ConfirmCodeService');
            this.httpRequestErrors.throwError('invalid-email-verify-code');
        }

        const emailAlreadyExist = await this.usersRepository.find({ email });

        if (emailAlreadyExist.length) {
            this.logger('error', 'Email already exists - CreateUserService');
            this.httpRequestErrors.throwError('email-already-exist');
        }

        const emailChanged = this._changeEmail({ user: userInDb, email });

        await this.usersRepository.update({ id: userInDb.userId, payload: emailChanged });
    }
}
