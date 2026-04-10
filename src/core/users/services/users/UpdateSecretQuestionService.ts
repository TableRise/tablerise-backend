import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateSecretQuestionPayload } from 'src/types/api/users/http/payload';
import { __FullUser } from 'src/types/api/users/methods';

export default class UpdateSecretQuestionService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly stateMachine;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['updateSecretQuestionServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
    }

    public async update({ userId, payload }: UpdateSecretQuestionPayload): Promise<__FullUser> {
        this.logger('info', 'Update - UpdateSecretQuestionService');
        const { flows } = this.stateMachine.props;

        if (!payload.answer || !payload.question) HttpRequestErrors.throwError('new-structure-secret-question-missing');

        const userInDb = await this.usersRepository.findOne({ userId });
        const userDetailsInDb = await this.usersDetailsRepository.findOne({ userId });

        userDetailsInDb.secretQuestion = {
            question: payload.question,
            answer: payload.answer,
        };

        await this.stateMachine.machine(flows.UPDATE_SECRET_QUESTION, userInDb);

        return { user: userInDb, userDetails: userDetailsInDb };
    }

    public async save(fullUser: __FullUser): Promise<void> {
        await this.usersRepository.update({
            query: { userId: fullUser.user.userId },
            payload: fullUser.user,
        });

        await this.usersDetailsRepository.update({
            query: { userDetailId: fullUser.userDetails.userDetailId },
            payload: fullUser.userDetails,
        });
    }
}
