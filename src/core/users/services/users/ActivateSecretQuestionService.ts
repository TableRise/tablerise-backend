import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { ActivateSecretQuestionPayload } from 'src/types/api/users/http/payload';
import { ActivateSecretQuestionResponse, CompleteUserResponse } from 'src/types/api/users/http/response';

export default class ActivateSecretQuestionService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly stateMachine;
    private readonly logger;

    constructor({
        usersDetailsRepository,
        usersRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['activateSecretQuestionServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.activate = this.activate.bind(this);
        this.save = this.save.bind(this);
    }

    public async activate({ userId, payload }: ActivateSecretQuestionPayload): Promise<CompleteUserResponse> {
        this.logger('info', 'Activate - ActivateSecretQuestionService');
        const { status, flows } = this.stateMachine.props;

        const userInDb = await this.usersRepository.findOne({ userId });
        const userDetailsInDb = await this.usersDetailsRepository.findOne({ userId });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');
        if (userInDb.inProgress.status !== status.WAIT_TO_ACTIVATE_SECRET_QUESTION)
            HttpRequestErrors.throwError('invalid-user-status');
        if (!payload) HttpRequestErrors.throwError('new-structure-secret-question-missing');

        userInDb.twoFactorSecret = { active: false, qrcode: '', secret: '' };
        userDetailsInDb.secretQuestion = payload;

        await this.stateMachine.machine(flows.ACTIVATE_SECRET_QUESTION, userInDb);

        return { user: userInDb, details: userDetailsInDb };
    }

    public async save(payload: CompleteUserResponse): Promise<ActivateSecretQuestionResponse> {
        const { user, details } = payload;

        const userInDb = await this.usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        await this.usersDetailsRepository.update({
            query: { userId: user.userId },
            payload: details,
        });

        return { active: userInDb.twoFactorSecret.active };
    }
}
