import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { CampaignPlayerInvitationEmailSend } from 'src/types/modules/core/campaigns/campaigns/PostInvitationEmail';

export default class PostInvitationEmailService {
    private readonly emailSender;
    private readonly logger;

    constructor({ emailSender, logger }: CampaignCoreDependencies['postInvitationEmailServiceContract']) {
        this.emailSender = emailSender;
        this.logger = logger;
    }

    private async send(payload: CampaignPlayerInvitationEmailSend): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.send.name}`;
        this.logger('info', callName);
        this.emailSender.type = 'invitation';

        const emailSendResult = await this.emailSender.send(
            {
                campaignId: payload.campaignId,
                userId: payload.userId,
                username: payload.username,
                subject: 'Email de Convite para Campanha - TableRise',
            },
            payload.targetEmail
        );

        if (!emailSendResult.success) {
            HttpRequestErrors.throwError('verification-email-send-fail');
        }
    }

    public async sendEmail(payload: CampaignPlayerInvitationEmailSend): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.sendEmail.name}`;
        this.logger('info', callName);
        await this.send(payload);
    }
}
