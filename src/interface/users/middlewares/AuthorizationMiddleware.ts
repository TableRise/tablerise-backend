import speakeasy from 'speakeasy';
import { NextFunction, Request, Response } from 'express';
import { JWTResponsePayload } from 'src/types/Response';
import { AuthorizationMiddlewareContract } from 'src/types/contracts/users/middlewares/AuthorizationMiddleware';

export default class AuthorizationMiddleware extends AuthorizationMiddlewareContract {
    constructor({ usersModel, usersDetailsModel, logger }: AuthorizationMiddlewareContract) {
        super();
        this.usersModel = usersModel;
        this.usersDetailsModel = usersDetailsModel;
        this.logger = logger;
    }

    public async checkAdminRole(req: Request, _res: Response, next: NextFunction): Promise<void> {
        this.logger('warn', '[CheckAdminRole - AuthorizationMiddleware]');

        const { userId } = req.user as JWTResponsePayload;

        const userDetail = await this.usersDetailsModel.findAll({ userId });

        if (!userDetail.length) {
            this.logger('error', 'User Detail was not found on database - AuthorizationMiddleware');
            this.httpRequestErrors.throwError('user-inexistent');
        }

        if (userDetail[0].role === 'admin') {
            next();
        } else {
            this.logger('error', 'User do not have authorization to perform this operation - AuthorizationMiddleware');
            this.httpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(req: Request, _res: Response, next: NextFunction): Promise<void> {
        this.logger('warn', '[TwoFactor - AuthorizationMiddleware]');

        const { id } = req.params;
        const { token } = req.query;

        const user = await this.usersModel.findOne(id);

        if (!user) {
            this.logger('error', 'User was not found on database - AuthorizationMiddleware');
            this.httpRequestErrors.throwError('user-inexistent');
        };

        if (!user.twoFactorSecret) {
            next();
            return;
        }

        const validateSecret = speakeasy.totp.verify({
            secret: user.twoFactorSecret.secret as string,
            encoding: 'base32',
            token: token as string,
        });

        if (!validateSecret) {
            this.logger('error', '2FA is invalid - AuthorizationMiddleware');
            this.httpRequestErrors.throwError('2fa-incorrect');
        };

        next();
    }
}
