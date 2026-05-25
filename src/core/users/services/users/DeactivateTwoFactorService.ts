import User from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class DeactivateTwoFactorService {
    private readonly usersRepository;
    private readonly stateMachine;
    private readonly logger;

    constructor({ usersRepository, stateMachine, logger }: UserCoreDependencies['deactivateTwoFactorServiceContract']) {
        this.usersRepository = usersRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.deactivate = this.deactivate.bind(this);
        this.save = this.save.bind(this);
    }

    public async deactivate(userId: string): Promise<User> {
        const callName = `[${this.constructor.name}] - ${this.deactivate.name}`;
        this.logger('info', callName);
        const { status, flows } = this.stateMachine.props;

        const userInDb = await this.usersRepository.findOne({ userId });
        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        if (userInDb.inProgress.status !== status.WAIT_TO_DISABLE_TWO_FACTOR)
            HttpRequestErrors.throwError('invalid-user-status');
        if (!userInDb.twoFactorSecret.active) HttpRequestErrors.throwError('2fa-no-active');

        userInDb.twoFactorSecret = {
            active: false,
            secret: 'keep',
            qrcode: '',
        };

        await this.stateMachine.machine(flows.DISABLE_TWO_FACTOR, userInDb);

        return userInDb;
    }

    public async save(user: User): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);

        await this.usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });
    }
}
