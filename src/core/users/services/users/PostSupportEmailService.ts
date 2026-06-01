import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { PostSupportEmailPayload } from 'src/types/api/users/http/payload';

export default class PostSupportEmailService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly emailSender;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        emailSender,
        logger,
    }: UserCoreDependencies['postSupportEmailServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.emailSender = emailSender;
        this.logger = logger;
    }

    private resolveSenderName(firstName?: string, lastName?: string, nickname?: string): string {
        const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
        return fullName || (nickname as string);
    }

    public async sendEmail({ userId, payload }: PostSupportEmailPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.sendEmail.name}`;
        this.logger('info', callName);

        const user = await this.usersRepository.findOne({ userId });
        const userDetails = await this.usersDetailsRepository.findOne({ userId });

        const senderName = this.resolveSenderName(userDetails.firstName, userDetails.lastName, user.nickname);
        this.emailSender.type = 'support';

        const emailSended = await this.emailSender.send(
            {
                username: senderName,
                userEmail: user.email,
                title: payload.title,
                category: payload.category,
                campaignCode: payload.campaignCode,
                body: payload.content,
                subject: `Solicitacao de suporte - TableRise`,
                replyTo: user.email,
            },
            process.env.EMAIL_FROM as string
        );

        if (!emailSended.success) HttpRequestErrors.throwError('verification-email-send-fail');
    }
}
