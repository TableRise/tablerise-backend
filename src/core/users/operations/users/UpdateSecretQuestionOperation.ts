import { UpdateSecretQuestionOperationContract } from 'src/types/users/contracts/core/UpdateSecretQuestion';
import { UpdateSecretQuestionPayload } from 'src/types/users/requests/Payload';

export default class UpdateSecretQuestionOperation {
    private readonly _updateSecretQuestionService;
    private readonly _logger;

    constructor({
        updateSecretQuestionService,
        logger,
    }: UpdateSecretQuestionOperationContract) {
        this._updateSecretQuestionService = updateSecretQuestionService;
        this._logger = logger;
    }

    public async execute({
        userId,
        payload,
    }: UpdateSecretQuestionPayload): Promise<void> {
        this._logger('info', 'Execute - UpdateSecretQuestionOperation');
        await this._updateSecretQuestionService.update({ userId, payload });
    }
}
