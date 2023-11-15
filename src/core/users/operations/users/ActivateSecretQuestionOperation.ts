import { ActivateSecretQuestionOperationContract } from 'src/types/users/contracts/core/ActivateSecretQuestion';
import { ActivateSecretQuestionPayload } from 'src/types/users/requests/Payload';

export default class ActivateSecretQuestionOperation {
    private readonly _activateSecretQuestionService;
    private readonly _logger;

    constructor({
        activateSecretQuestionService,
        logger,
    }: ActivateSecretQuestionOperationContract) {
        this._activateSecretQuestionService = activateSecretQuestionService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        userId,
        payload,
    }: ActivateSecretQuestionPayload, isUpdate: boolean): Promise<void> {
        this._logger('info', 'Execute - ActivateSecretQuestionOperation');

        const { user, userDetails } = await this._activateSecretQuestionService.activate({
            userId,
            payload,
        }, isUpdate);

        await this._activateSecretQuestionService.save({ user, userDetails });
    }
}
