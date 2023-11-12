import { ActivateSecretQuestionServiceContract } from 'src/types/users/contracts/core/ActivateSecretQuestion';
import { ActivateSecretQuestionPayload } from 'src/types/users/requests/Payload';
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
    }: ActivateSecretQuestionPayload): Promise<__FullUser> {
        this._logger('info', 'Activate - ActivateSecretQuestionService');
        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId });

        userInDb.twoFactorSecret = { active: false };

        userDetailsInDb.secretQuestion = {
            question: payload.question,
            answer: payload.answer,
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
