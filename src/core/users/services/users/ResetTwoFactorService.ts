import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { TwoFactorResponse } from 'src/types/api/users/http/response';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';

export default class ResetTwoFactorService {
    private readonly _usersRepository;
    private readonly _twoFactorHandler;
    private readonly _logger;

    constructor({
        usersRepository,
        twoFactorHandler,
        logger,
    }: UserCoreDependencies['resetTwoFactorServiceContract']) {
        this._usersRepository = usersRepository;
        this._twoFactorHandler = twoFactorHandler;
        this._logger = logger;

        this.reset = this.reset.bind(this);
        this.save = this.save.bind(this);
    }

    public async reset(userId: string): Promise<UserInstance> {
        this._logger('info', 'Reset - ResetTwoFactorService');
        const userInDb = await this._usersRepository.findOne({ userId });

        userInDb.twoFactorSecret = await this._twoFactorHandler.create(userInDb.email);

        return userInDb;
    }

    public async save(user: UserInstance): Promise<TwoFactorResponse> {
        this._logger('info', 'Save - ResetTwoFactorService');

        await this._usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        delete user.twoFactorSecret.secret;
        return user.twoFactorSecret as TwoFactorResponse;
    }
}
