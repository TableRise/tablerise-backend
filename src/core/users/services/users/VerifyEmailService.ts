import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { VerifyEmailServiceContract } from 'src/types/contracts/users/core/VerifyEmail';
import { VerifyEmailPayload } from 'src/types/requests/Payload';

export default class VerifyEmailService {
    private readonly _usersRepository;
    private readonly _emailSender;
    private readonly _logger;

    constructor({ usersRepository, emailSender, logger }: VerifyEmailServiceContract) {
        this._usersRepository = usersRepository;
        this._emailSender = emailSender;
        this._logger = logger;
    }

    private async _send(user: UserInstance, email: string): Promise<UserInstance> {
        this._logger('info', 'Send - SendEmail - VerifyEmailService');
        this._emailSender.type = 'verification';
        
        const emailSendResult = await this._emailSender.send(
            {
                username: user.nickname,
                subject: 'Email de verificação - TableRise',
            },
            email || user.email
        );

        if (!emailSendResult.success) {
            this._logger(
                'error',
                'Some error ocurred in email sending - VerifyEmailService'
            );
            HttpRequestErrors.throwError('user-inexistent');
        }

        user.inProgress = {
            status: 'wait_to_verify',
            code: emailSendResult.verificationCode as string,
        };

        return user;
    }

    public async sendEmail({ userId, email }: VerifyEmailPayload): Promise<void> {
        this._logger('info', 'SendEmail - VerifyEmailService');
        const userInDb = await this._usersRepository.findOne({ userId });

        const userToUpdate = await this._send(userInDb, email);

        userToUpdate.updatedAt = new Date().toISOString();

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userToUpdate,
        });
    }
}
