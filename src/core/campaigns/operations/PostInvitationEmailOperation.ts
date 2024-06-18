import { PostInvitationEmailPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostInvitationEmailOperation {
    private readonly _logger;
    private readonly _postInvitationEmailService;

    constructor({
        postInvitationEmailService,
        logger,
    }: CampaignCoreDependencies['postInvitationEmailOperation']) {
        this._logger = logger;
        this._postInvitationEmailService = postInvitationEmailService;

        this.execute = this.execute.bind(this);
    }

    public async execute({ email, campaignId, userId }: PostInvitationEmailPayload): Promise<void> {
        this._logger('info', 'Execute - PostInvitationEmailOperation');
        await this._postInvitationEmailService.sendEmail({ email, campaignId, userId });
    }
}
