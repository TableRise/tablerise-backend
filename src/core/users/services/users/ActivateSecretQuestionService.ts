import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import {
    ActivateSecretQuestionPayload,
    UpdateSecretQuestion,
} from 'src/types/api/users/http/payload';

export default class ActivateSecretQuestionService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        usersRepository,
        logger,
    }: UserCoreDependencies['activateSecretQuestionServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.activate = this.activate.bind(this);
    }

    public async activate(
        { userId, payload }: ActivateSecretQuestionPayload,
    ): Promise<void> {
        this._logger('info', 'Activate - ActivateSecretQuestionService');

        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');
        if (!userDetailsInDb.secretQuestion) HttpRequestErrors.throwError('incorrect-secret-question');

        const data = payload as UpdateSecretQuestion;

        if (!data.new) HttpRequestErrors.throwError('new-structure-secret-question-missing');

        userInDb.twoFactorSecret.active = false;

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });
    }
}
