import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { CampaignPlayerInvitationPayload } from 'src/types/modules/core/campaigns/campaigns/PostInvitationEmail';

export default class PostInvitationEmailOperation {
    private readonly usersRepository;
    private readonly postInvitationEmailService;
    private readonly logger;

    constructor({
        usersRepository,
        postInvitationEmailService,
        logger,
    }: CampaignCoreDependencies['postInvitationEmailOperationContract']) {
        this.usersRepository = usersRepository;
        this.postInvitationEmailService = postInvitationEmailService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ targetEmail, campaignId }: CampaignPlayerInvitationPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const user = await this.usersRepository.findOne({ email: targetEmail });

        await this.postInvitationEmailService.sendEmail({
            userId: user.userId,
            username: user.nickname,
            targetEmail,
            campaignId,
        });
    }
}
