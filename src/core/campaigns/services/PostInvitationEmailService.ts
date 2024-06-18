import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { PostInvitationEmailPayload } from 'src/types/api/campaigns/http/payload';

export default class PostInvitationEmailService {
    private readonly _usersRepository;
    private readonly _emailSender;
    private readonly _logger;

    constructor({
        usersRepository,
        emailSender,
        logger,
    }: CampaignCoreDependencies['postInvitationEmailServiceContract']) {
        this._usersRepository = usersRepository;
        this._emailSender = emailSender;
        this._logger = logger;
    }

    private async _send(campaignId: string, user: UserInstance, emailSended: string): Promise<UserInstance> {
        this._logger('info', 'Send - SendEmail - PostInvitationEmailService');
        this._emailSender.type = 'invitation';

        const emailSendResult = await this._emailSender.send(
            {
                campaignId: campaignId,
                userId: user.userId,
                username: user.nickname,
                subject: 'Email de Convite para Campanha - TableRise',
            },
            emailSended || user.email
        );

        if (!emailSendResult.success) {
            this._logger(
                'error',
                'Some error ocurred in email sending - PostInvitationEmailService'
            );
            HttpRequestErrors.throwError('campaign-inexistent');
        }

        return user;
    }

    public async sendEmail({ email, campaignId, userId }: PostInvitationEmailPayload): Promise<void> {
        this._logger('info', 'SendEmail - PostInvitationEmailService');
        const userInDb = await this._usersRepository.findOne({ userId });

        await this._send(campaignId, userInDb, email);
    }
}
