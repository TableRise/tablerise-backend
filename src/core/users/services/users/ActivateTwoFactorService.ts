import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';
import { __FullUser } from 'src/types/api/users/methods';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class ActivateTwoFactorService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly stateMachine;
    private readonly twoFactorHandler;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        twoFactorHandler,
        logger,
    }: UserCoreDependencies['activateTwoFactorServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.stateMachine = stateMachine;
        this.twoFactorHandler = twoFactorHandler;
        this.logger = logger;

        this.activate = this.activate.bind(this);
        this.save = this.save.bind(this);
    }

    public async activate(userId: string): Promise<__FullUser> {
        const callName = `[${this.constructor.name}] - ${this.activate.name}`;
        this.logger('info', callName);
        const { status, flows } = this.stateMachine.props;

        const userInDb = await this.usersRepository.findOne({ userId });

        if (userInDb.inProgress.status !== status.WAIT_TO_ACTIVATE_TWO_FACTOR)
            HttpRequestErrors.throwError('invalid-user-status');
        if (userInDb.twoFactorSecret.active) HttpRequestErrors.throwError('2fa-already-active');

        userInDb.twoFactorSecret = await this.twoFactorHandler.create(userInDb.email);

        const userDetailInDb = await this.usersDetailsRepository.findOne({
            userId: userInDb.userId,
        });

        await this.stateMachine.machine(flows.ACTIVATE_TWO_FACTOR, userInDb);

        return { user: userInDb, userDetails: userDetailInDb };
    }

    public async save({ user, userDetails }: __FullUser): Promise<TwoFactorResponse> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);

        const userSaved = await this.usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        await this.usersDetailsRepository.update({
            query: { userId: userSaved.userId },
            payload: userDetails,
        });

        return {
            qrcode: user.twoFactorSecret.qrcode,
            active: user.twoFactorSecret.active,
        };
    }
}
