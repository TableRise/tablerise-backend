import { NextFunction, Request, Response } from 'express';
import { JWTResponse } from 'src/types/users/requests/Response';
import { AuthorizationMiddlewareContract } from 'src/types/users/contracts/middlewares/AuthorizationMiddleware';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { UserSecretQuestion } from 'src/domains/user/schemas/userDetailsValidationSchema';

export default class AuthorizationMiddleware {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _twoFactorHandler;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        twoFactorHandler,
        logger,
    }: AuthorizationMiddlewareContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._twoFactorHandler = twoFactorHandler;
        this._logger = logger;

        this.checkAdminRole = this.checkAdminRole.bind(this);
        this.twoFactor = this.twoFactor.bind(this);
    }

    public async checkAdminRole(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'CheckAdminRole - AuthorizationMiddleware');

        const { userId } = req.user as JWTResponse;

        const userDetail = await this._usersDetailsRepository.findOne({ userId });

        if (!userDetail) HttpRequestErrors.throwError('user-inexistent');

        if (userDetail.role === 'admin') {
            next();
        } else {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'TwoFactor - AuthorizationMiddleware');

        const { id } = req.params;
        const { token } = req.query;

        const user = await this._usersRepository.findOne({ userId: id });

        if (!user) HttpRequestErrors.throwError('user-inexistent');

        if (!user.twoFactorSecret.active) {
            next();
            return;
        }

        const validateSecret = this._twoFactorHandler.validate({
            secret: user.twoFactorSecret.secret as string,
            token: token as string,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        next();
    }

    public async secretQuestion(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'SecretQuestion - AuthorizationMiddleware');

        const { id } = req.params;
        const payload = req.body as UserSecretQuestion;

        const userDetailsInDb = await this._usersDetailsRepository.findOne({
            userId: id,
        });

        if (!userDetailsInDb.secretQuestion) {
            next();
            return;
        }

        if (payload.question !== userDetailsInDb.secretQuestion.question)
            HttpRequestErrors.throwError('incorrect-secret-question');
        if (payload.answer !== userDetailsInDb.secretQuestion.answer)
            HttpRequestErrors.throwError('incorrect-secret-question');

        next();
    }
}
