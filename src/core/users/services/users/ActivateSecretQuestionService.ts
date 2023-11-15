import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { ActivateSecretQuestionServiceContract } from 'src/types/users/contracts/core/ActivateSecretQuestion';
import { ActivateSecretQuestionPayload, UpdateSecretQuestion } from 'src/types/users/requests/Payload';
import { __FullUser } from 'src/types/users/requests/Response';

export default class ActivateSecretQuestionService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        usersRepository,
        logger,
    }: ActivateSecretQuestionServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.activate = this.activate.bind(this);
        this.save = this.save.bind(this);
    }

    public async activate({
        userId,
        payload,
    }: ActivateSecretQuestionPayload, isUpdate: boolean = false): Promise<__FullUser> {
        this._logger('info', 'Activate - ActivateSecretQuestionService');
        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userDetailsInDb.secretQuestion  && isUpdate)
            HttpRequestErrors.throwError('incorrect-secret-question');
        
        const data = payload as UpdateSecretQuestion;

        if(isUpdate && !data.new)
            HttpRequestErrors.throwError('new-structure-secret-question-missing');

        const newQuestion = isUpdate ? data.new.question : data.question;
        const newAnswer = isUpdate ? data.new.answer : data.answer;

        userInDb.twoFactorSecret = { active: false };

        userDetailsInDb.secretQuestion = {
            question: newQuestion,
            answer: newAnswer,
        };

        return { user: userInDb, userDetails: userDetailsInDb };
    }

    public async save({ user, userDetails }: __FullUser): Promise<void> {
        this._logger('info', 'Save - ActivateSecretQuestionService');
        await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        await this._usersDetailsRepository.update({
            query: { userId: user.userId },
            payload: userDetails,
        });
    }
}
