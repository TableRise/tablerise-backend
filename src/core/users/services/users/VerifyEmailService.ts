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
        const callName = `[${this.constructor.name}] - ${this.send.name}`;
        this.logger('info', callName);
        this.emailSender.type = 'verification';

        const emailSendResult = await this.emailSender.send(
            {
                username: user.nickname,
                subject: 'Email de verificação - TableRise',
            },
            user.email
        );

        if (!emailSendResult.success) HttpRequestErrors.throwError('user-inexistent');
        user.inProgress.code = emailSendResult.verificationCode as string;
        return this.stateMachine.machine(flow, user);
    }

    public async sendEmail({ email, flow }: VerifyEmailPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.sendEmail.name}`;
        this.logger('info', callName);
        const userInDb = await this.usersRepository.findOne({ email });

        const userUpdated = await this.send(userInDb, flow as stateFlowsKeys);

        await this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userUpdated,
        });
    }
}
