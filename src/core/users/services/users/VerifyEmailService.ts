import { UserInstance, UserVerifyEmail } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import StateMachine from 'src/domains/users/StateMachine';
import { StateMachineFlowKeys } from 'src/types/modules/domains/users/StateMachine';

export default class VerifyEmailService {
    private readonly _usersRepository;
    private readonly _emailSender;
    private readonly _logger;

    constructor({
        usersRepository,
        emailSender,
        logger,
    }: UserCoreDependencies['verifyEmailServiceContract']) {
        this._usersRepository = usersRepository;
        this._emailSender = emailSender;
        this._logger = logger;
    }

    private async _send(user: UserInstance, flow: StateMachineFlowKeys): Promise<UserInstance> {
        this._logger('info', 'Send - SendEmail - VerifyEmailService');
        this._emailSender.type = 'verification';

        const emailSendResult = await this._emailSender.send(
            {
                username: user.nickname,
                subject: 'Email de verificação - TableRise',
            },
            user.email
        );

        if (!emailSendResult.success) {
            this._logger(
                'error',
                'Some error ocurred in email sending - VerifyEmailService'
            );
            HttpRequestErrors.throwError('user-inexistent');
        }

        user.inProgress = {
            status: StateMachine(flow, user.inProgress.status),
            code: emailSendResult.verificationCode as string,
        };

        return user;
    }

    public async sendEmail({ email, flow }: UserVerifyEmail): Promise<void> {
        this._logger('info', 'SendEmail - VerifyEmailService');
        const userInDb = await this._usersRepository.findOne({ email });

        const userToUpdate = await this._send(userInDb, flow as StateMachineFlowKeys);

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userToUpdate,
        });
    }
}
