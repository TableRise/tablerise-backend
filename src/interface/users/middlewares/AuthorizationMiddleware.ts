import speakeasy from 'speakeasy';
import { NextFunction, Request, Response } from 'express';
import { JWTResponse } from 'src/types/requests/Response';
import { AuthorizationMiddlewareContract } from 'src/types/contracts/users/middlewares/AuthorizationMiddleware';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';

export default class AuthorizationMiddleware {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: AuthorizationMiddlewareContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
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
        this._logger('warn', '[TwoFactor - AuthorizationMiddleware]');

        const { id } = req.params;
        const { token } = req.query;

        const user = await this._usersRepository.findOne({ userId: id });

        if (!user) HttpRequestErrors.throwError('user-inexistent');

        if (!user.twoFactorSecret.active) {
            next();
            return;
        }

        const validateSecret = speakeasy.totp.verify({
            secret: user.twoFactorSecret.secret as string,
            encoding: 'base32',
            token: token as string,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        next();
    }
}
