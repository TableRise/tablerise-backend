import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateSecretQuestionPayload } from 'src/types/api/users/http/payload';
import { UpdateSecretQuestionResponse } from 'src/types/api/users/http/response';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

export default class UpdateSecretQuestionService {
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['updateSecretQuestionServiceContract']) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;
        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
    }

    public async update({
        userId,
        payload,
    }: UpdateSecretQuestionPayload): Promise<UserDetailInstance> {
        this._logger('info', 'Update - UpdateSecretQuestionService');

        const { new: newQuestion } = payload;

        if (!newQuestion)
            HttpRequestErrors.throwError('new-structure-secret-question-missing');

        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userDetailsInDb.secretQuestion)
            HttpRequestErrors.throwError('incorrect-secret-question');

        userDetailsInDb.secretQuestion.question = newQuestion.question;
        userDetailsInDb.secretQuestion.answer = newQuestion.answer;

        return userDetailsInDb;
    }

    public async save(
        userDetails: UserDetailInstance
    ): Promise<UpdateSecretQuestionResponse> {
        const userDetailsInDb = await this._usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
        return { newQuestion: userDetailsInDb.secretQuestion };
    }
}
