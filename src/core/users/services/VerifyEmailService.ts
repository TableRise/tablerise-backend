import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { VerifyEmailServiceContract } from 'src/types/contracts/users/VerifyEmail';

export abstract class VerifyEmailService extends VerifyEmailServiceContract {
    constructor({ usersRepository, httpRequestErrors, emailSender, logger }: VerifyEmailServiceContract) {
        super();
        this.usersRepository = usersRepository;
        this.httpRequestErrors = httpRequestErrors;
        this.emailSender = emailSender;
        this.logger = logger;
    }

    private async _send(user: UserInstance): Promise<UserInstance> {
        this.logger('info', '[Send - SendEmail - VerifyEmailService]');
        this.emailSender.type = 'verification';

        const emailSendResult = await this.emailSender.send({
            username: user.nickname,
            subject: 'Email de verificação - TableRise',
        }, user.email);

        if (!emailSendResult.success) {
            this.logger('error', 'Some error ocurred in email sending - VerifyEmailService');
            this.httpRequestErrors.throwError('user-inexistent');
        }

        user.inProgress = {
            status: 'wait_to_verify',
            code: emailSendResult.verificationCode as string
        }

        return user;
    }

    public async sendEmail(userId: string): Promise<void> {
        this.logger('info', '[SendEmail - VerifyEmailService]');
        const userInDb = await this.usersRepository.findOne(userId);

        const userToUpdate = await this._send(userInDb);

        userToUpdate.updatedAt = new Date().toISOString();

        await this.usersRepository.update({ id: userInDb.userId, payload: userToUpdate });
    }
}
