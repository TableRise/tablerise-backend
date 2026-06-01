import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { PostSupportEmailPayload } from 'src/types/api/users/http/payload';

export default class PostSupportEmailOperation {
    private readonly logger;
    private readonly postSupportEmailService;

    constructor({ postSupportEmailService, logger }: UserCoreDependencies['postSupportEmailOperationContract']) {
        this.logger = logger;
        this.postSupportEmailService = postSupportEmailService;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: PostSupportEmailPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        await this.postSupportEmailService.sendEmail(payload);
    }
}
