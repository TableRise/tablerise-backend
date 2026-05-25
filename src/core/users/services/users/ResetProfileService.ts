import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class ResetProfileService {
    private readonly usersDetailsRepository;
    private readonly stateMachine;
    private readonly usersRepository;
    private readonly logger;

    constructor({
        usersDetailsRepository,
        stateMachine,
        usersRepository,
        logger,
    }: UserCoreDependencies['resetProfileServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.reset = this.reset.bind(this);
    }

    public async reset(userId: string): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.reset.name}`;
        this.logger('info', callName);
        const { status, flows } = this.stateMachine.props;

        const userInDb = await this.usersRepository.findOne({ userId });
        const userDetailInDb = await this.usersDetailsRepository.findOne({ userId });
        if (!userInDb || !userDetailInDb) HttpRequestErrors.throwError('user-inexistent');

        if (userInDb.inProgress.status !== status.WAIT_TO_RESET_PROFILE)
            HttpRequestErrors.throwError('invalid-user-status');

        userDetailInDb.gameInfo.badges = [];
        userDetailInDb.gameInfo.campaigns = [];
        userDetailInDb.gameInfo.characters = [];

        const userUpdated = await this.stateMachine.machine(flows.RESET_PROFILE, userInDb);

        await this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userUpdated,
        });

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }
}
