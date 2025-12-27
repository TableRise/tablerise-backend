import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateSecretQuestionPayload } from 'src/types/api/users/http/payload';

export default class UpdateSecretQuestionOperation {
    private readonly updateSecretQuestionService;
    private readonly logger;

    constructor({
        updateSecretQuestionService,
        logger,
    }: UserCoreDependencies['updateSecretQuestionOperationContract']) {
        this.updateSecretQuestionService = updateSecretQuestionService;
        this.logger = logger;
    }

    public async execute({ userId, payload }: UpdateSecretQuestionPayload): Promise<void> {
        this.logger('info', 'Execute - UpdateSecretQuestionOperation');
        const userDetailsInDb = await this.updateSecretQuestionService.update({
            userId,
            payload,
        });

        await this.updateSecretQuestionService.save(userDetailsInDb);
    }
}
