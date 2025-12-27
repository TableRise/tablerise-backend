import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class ResetTwoFactorService {
    private readonly usersRepository;
    private readonly twoFactorHandler;
    private readonly stateMachine;
    private readonly logger;

    constructor({
        usersRepository,
        twoFactorHandler,
        stateMachine,
        logger,
    }: UserCoreDependencies['resetTwoFactorServiceContract']) {
        this.usersRepository = usersRepository;
        this.twoFactorHandler = twoFactorHandler;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.reset = this.reset.bind(this);
        this.save = this.save.bind(this);
    }

    public async reset(userId: string): Promise<User> {
        this.logger('info', 'Reset - ResetTwoFactorService');
        const { status, flows } = this.stateMachine.props;
        const userInDb = await this.usersRepository.findOne({ userId });

        if (userInDb.inProgress.status !== status.WAIT_TO_FINISH_RESET_TWO_FACTOR)
            HttpRequestErrors.throwError('invalid-user-status');

        userInDb.twoFactorSecret = await this.twoFactorHandler.create(userInDb.email);

        await this.stateMachine.machine(flows.RESET_TWO_FACTOR, userInDb);

        return userInDb;
    }

    public async save(user: User): Promise<TwoFactorResponse> {
        this.logger('info', 'Save - ResetTwoFactorService');

        await this.usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        return {
            qrcode: user.twoFactorSecret.qrcode,
            active: user.twoFactorSecret.active,
        };
    }
}
