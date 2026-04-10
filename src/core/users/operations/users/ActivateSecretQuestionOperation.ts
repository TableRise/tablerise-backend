import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { ActivateSecretQuestionPayload } from 'src/types/api/users/http/payload';
import { ActivateSecretQuestionResponse } from 'src/types/api/users/http/response';

export default class ActivateSecretQuestionOperation {
    private readonly activateSecretQuestionService;
    private readonly logger;

    constructor({
        activateSecretQuestionService,
        logger,
    }: UserCoreDependencies['activateSecretQuestionOperationContract']) {
        this.activateSecretQuestionService = activateSecretQuestionService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, payload }: ActivateSecretQuestionPayload): Promise<ActivateSecretQuestionResponse> {
        this.logger('info', 'Execute - ActivateSecretQuestionOperation');

        const user = await this.activateSecretQuestionService.activate({
            userId,
            payload,
        });

        return this.activateSecretQuestionService.save(user);
    }
}
