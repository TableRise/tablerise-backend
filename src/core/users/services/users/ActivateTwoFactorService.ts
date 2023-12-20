import { ActivateTwoFactorServiceContract } from 'src/types/users/contracts/core/ActivateTwoFactor';
import { TwoFactorResponse, __FullUser } from 'src/types/users/requests/Response';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class ActivateTwoFactorService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _twoFactorHandler;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        twoFactorHandler,
        logger,
    }: ActivateTwoFactorServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._twoFactorHandler = twoFactorHandler;
        this._logger = logger;

        this.activate = this.activate.bind(this);
        this.save = this.save.bind(this);
    }

    public async activate(userId: string, isReset: boolean = false): Promise<__FullUser> {
        this._logger('info', 'Activate - ActivateTwoFactorService');
        const userInDb = await this._usersRepository.findOne({ userId });

        if (!userInDb.twoFactorSecret.active && isReset)
            HttpRequestErrors.throwError('2fa-no-active');
        if (userInDb.twoFactorSecret.active && !isReset)
            HttpRequestErrors.throwError('2fa-already-active');

        userInDb.twoFactorSecret = await this._twoFactorHandler.create(userInDb.email);
        const userDetailInDb = await this._usersDetailsRepository.findOne({
            userId: userInDb.userId,
        });

        userDetailInDb.secretQuestion = null;

        return { user: userInDb, userDetails: userDetailInDb };
    }

    public async save({ user, userDetails }: __FullUser): Promise<TwoFactorResponse> {
        this._logger('info', 'Save - ActivateTwoFactorService');

        const userSaved = await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        await this._usersDetailsRepository.update({
            query: { userId: userSaved.userId },
            payload: userDetails,
        });

        delete user.twoFactorSecret.secret;
        return user.twoFactorSecret as TwoFactorResponse;
    }
}
