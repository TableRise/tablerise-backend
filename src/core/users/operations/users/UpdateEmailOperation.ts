import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateEmailPayload } from 'src/types/api/users/http/payload';

export default class UpdateEmailOperation {
    private readonly updateEmailService;
    private readonly schemaValidator;
    private readonly logger;

    constructor({
        updateEmailService,
        schemaValidator,
        logger,
    }: UserCoreDependencies['updateEmailOperationContract']) {
        this.updateEmailService = updateEmailService;
        this.schemaValidator = schemaValidator;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, email }: UpdateEmailPayload): Promise<void> {
        this.logger('info', 'Execute - UpdateEmailOperation');
        await this.updateEmailService.update({ userId, email });
    }
}
