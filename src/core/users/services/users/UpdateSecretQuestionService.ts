import HttpRequestErrors from "src/infra/helpers/common/HttpRequestErrors";
import { UpdateSecretQuestionServiceContract } from "src/types/users/contracts/core/UpdateSecretQuestion";
import { UpdateSecretQuestionPayload } from "src/types/users/requests/Payload";

export default class UpdateSecretQuestionService {
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({ usersDetailsRepository, logger }: UpdateSecretQuestionServiceContract) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;
    }

    public async update({ userId, payload }: UpdateSecretQuestionPayload): Promise<void> {
        this._logger('info', 'Update - UpdateSecretQuestionService');

        const { new: newQuestion } = payload;
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userDetailsInDb.secretQuestion)
            HttpRequestErrors.throwError('incorrect-secret-question');

        userDetailsInDb.secretQuestion.question = newQuestion.question;
        userDetailsInDb.secretQuestion.answer = newQuestion.answer;

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailsInDb.userDetailId },
            payload: userDetailsInDb
        });
    }
}
