import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateSecretQuestionPayload } from 'src/types/api/users/http/payload';
import { UpdateSecretQuestionResponse } from 'src/types/api/users/http/response';

export default class UpdateSecretQuestionOperation {
    private readonly _updateSecretQuestionService;
    private readonly _logger;

    constructor({
        updateSecretQuestionService,
        logger,
    }: UserCoreDependencies['updateSecretQuestionOperationContract']) {
        this._updateSecretQuestionService = updateSecretQuestionService;
        this._logger = logger;
    }

    public async execute({
        userId,
        payload,
    }: UpdateSecretQuestionPayload): Promise<UpdateSecretQuestionResponse> {
        this._logger('info', 'Execute - UpdateSecretQuestionOperation');
        const userDetailsInDb = await this._updateSecretQuestionService.update({ userId, payload });
        return await this._updateSecretQuestionService.save(userDetailsInDb);
    }
}
