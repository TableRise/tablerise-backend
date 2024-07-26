import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import {
    ActivateSecretQuestionPayload,
} from 'src/types/api/users/http/payload';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { ActivateSecretQuestionResponse } from 'src/types/api/users/http/response';

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
        this.save = this.save.bind(this);
    }

    public async activate(
        { userId, payload }: ActivateSecretQuestionPayload,
    ): Promise<UserInstance> {
        this._logger('info', 'Activate - ActivateSecretQuestionService');

        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');
        if (!userDetailsInDb.secretQuestion) HttpRequestErrors.throwError('incorrect-secret-question');
        if (!payload) HttpRequestErrors.throwError('new-structure-secret-question-missing');

        userInDb.twoFactorSecret.active = false;

        return userInDb;

    }

    public async save( user: UserInstance ) : Promise<ActivateSecretQuestionResponse> {
        const userInDb =  await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });
        return { active:  userInDb.twoFactorSecret.active };
    }
}
