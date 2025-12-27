import { PostInvitationEmailPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostInvitationEmailOperation {
    private readonly campaignsSchema;
    private readonly schemaValidator;
    private readonly postInvitationEmailService;
    private readonly getCampaignByIdService;
    private readonly logger;

    constructor({
        campaignsSchema,
        schemaValidator,
        postInvitationEmailService,
        getCampaignByIdService,
        logger,
    }: CampaignCoreDependencies['postInvitationEmailOperation']) {
        this.campaignsSchema = campaignsSchema;
        this.schemaValidator = schemaValidator;
        this.postInvitationEmailService = postInvitationEmailService;
        this.getCampaignByIdService = getCampaignByIdService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ targetEmail, campaignId, userId, username }: PostInvitationEmailPayload): Promise<void> {
        this.logger('info', 'Execute - PostInvitationEmailOperation');
        await this.getCampaignByIdService.get({ campaignId });
        await this.postInvitationEmailService.sendEmail({
            targetEmail,
            campaignId,
            userId,
            username,
        });
    }
}
