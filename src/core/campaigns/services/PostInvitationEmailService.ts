import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { PostInvitationEmailPayload } from 'src/types/api/campaigns/http/payload';

export default class PostInvitationEmailService {
    private readonly _emailSender;
    private readonly _logger;

    constructor({
        emailSender,
        logger,
    }: CampaignCoreDependencies['postInvitationEmailServiceContract']) {
        this._emailSender = emailSender;
        this._logger = logger;
    }

    private async _send(campaignId: string, userId: string, username: string, emailSended: string): Promise<void> {
        this._logger('info', 'Send - SendEmail - PostInvitationEmailService');
        this._emailSender.type = 'invitation';

        const emailSendResult = await this._emailSender.send(
            {
                campaignId: campaignId,
                userId: userId,
                username: username,
                subject: 'Email de Convite para Campanha - TableRise',
            },
            emailSended
        );

        if (!emailSendResult.success) {
            this._logger(
                'error',
                'Some error ocurred in email sending - PostInvitationEmailService'
            );
            HttpRequestErrors.throwError('verification-email-send-fail');
        }

    }

    public async sendEmail({ targetEmail, campaignId, userId, username }: PostInvitationEmailPayload): Promise<void> {
        this._logger('info', 'SendEmail - PostInvitationEmailService');

        await this._send(campaignId, userId, username, targetEmail);
    }
}
