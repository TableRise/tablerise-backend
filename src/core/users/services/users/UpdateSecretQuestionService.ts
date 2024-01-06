import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateSecretQuestionPayload } from 'src/types/api/users/http/payload';

export default class UpdateSecretQuestionService {
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['updateSecretQuestionServiceContract']) {
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
            payload: userDetailsInDb,
        });
    }
}
