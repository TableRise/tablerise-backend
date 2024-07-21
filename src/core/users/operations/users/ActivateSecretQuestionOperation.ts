import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { ActivateSecretQuestionPayload } from 'src/types/api/users/http/payload';

export default class ActivateSecretQuestionOperation {
    private readonly _activateSecretQuestionService;
    private readonly _logger;

    constructor({
        activateSecretQuestionService,
        logger,
    }: UserCoreDependencies['activateSecretQuestionOperationContract']) {
        this._activateSecretQuestionService = activateSecretQuestionService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        { userId, payload }: ActivateSecretQuestionPayload,
    ): Promise<void> {
        this._logger('info', 'Execute - ActivateSecretQuestionOperation');

        await this._activateSecretQuestionService.activate({userId, payload});

    }
}
