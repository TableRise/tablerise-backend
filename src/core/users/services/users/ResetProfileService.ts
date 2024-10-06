import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import StateMachine from 'src/domains/common/StateMachine';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class ResetProfileService {
    private readonly _usersDetailsRepository;
    private readonly _stateMachineProps;
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        stateMachineProps,
        usersRepository,
        logger,
    }: UserCoreDependencies['resetProfileServiceContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachineProps = stateMachineProps;
        this._logger = logger;

        this.reset = this.reset.bind(this);
    }

    public async reset(userId: string): Promise<void> {
        this._logger('info', 'Reset - ResetProfileService');
        const { status, flows } = this._stateMachineProps;

        const userInDb = await this._usersRepository.findOne({ userId });
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        if (userInDb.inProgress.status !== status.WAIT_TO_RESET_PROFILE)
            HttpRequestErrors.throwError('invalid-user-status');

        userDetailInDb.gameInfo.badges = [];
        userDetailInDb.gameInfo.campaigns = [];
        userDetailInDb.gameInfo.characters = [];

        userInDb.inProgress.status = StateMachine(
            flows.RESET_PROFILE,
            userInDb.inProgress.status
        );

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }
}
