import User from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import { VerifyEmailPayload } from 'src/types/api/users/http/payload';

export default class VerifyEmailService {
    private readonly usersRepository;
    private readonly stateMachine;
    private readonly emailSender;
    private readonly logger;

    constructor({
        usersRepository,
        stateMachine,
        emailSender,
        logger,
    }: UserCoreDependencies['verifyEmailServiceContract']) {
        this.usersRepository = usersRepository;
        this.stateMachine = stateMachine;
        this.emailSender = emailSender;
        this.logger = logger;
    }

    private async send(user: User, flow: stateFlowsKeys): Promise<User> {
        this.logger('info', 'Send - SendEmail - VerifyEmailService');
        this.emailSender.type = 'verification';

        const emailSendResult = await this.emailSender.send(
            {
                username: user.nickname,
                subject: 'Email de verificação - TableRise',
            },
            user.email
        );

        if (!emailSendResult.success) {
            this.logger('error', 'Some error ocurred in email sending - VerifyEmailService');
            HttpRequestErrors.throwError('user-inexistent');
        }

        user.inProgress.code = emailSendResult.verificationCode as string;

        await this.stateMachine.machine(flow, user);

        return user;
    }

    public async sendEmail({ email, flow }: VerifyEmailPayload): Promise<void> {
        this.logger('info', 'SendEmail - VerifyEmailService');
        const userInDb = await this.usersRepository.findOne({ email });

        const userToUpdate = await this.send(userInDb, flow as stateFlowsKeys);

        await this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userToUpdate,
        });
    }
}
