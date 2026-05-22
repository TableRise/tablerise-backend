import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class DeleteUserService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly stateMachine;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        logger,
    }: UserCoreDependencies['deleteUserServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.delete = this.delete.bind(this);
    }

    public async delete(userId: string): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.delete.name}`;
        this.logger('info', callName);
        const { status, flows } = this.stateMachine.props;

        const userInDb = await this.usersRepository.findOne({ userId });
        const userDetailInDb = await this.usersDetailsRepository.findOne({ userId });

        if (!userInDb || !userDetailInDb) HttpRequestErrors.throwError('user-inexistent');
        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_DELETE_USER)
            HttpRequestErrors.throwError('invalid-user-status');
        if (userDetailInDb.gameInfo.campaigns.length || userDetailInDb.gameInfo.characters.length) {
            HttpRequestErrors.throwError('linked-mandatory-data-when-delete');
        }

        const userUpdated = await this.stateMachine.machine(flows.DELETE_PROFILE, userInDb);

        await this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userUpdated,
        });

        this.logger(
            'info',
            `Delete Service - User waiting to be deleted from database with ID ${userInDb.userId} and status ${userInDb.inProgress.status}`
        );
    }
}
