/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import 'dotenv/config';
import speakeasy from 'speakeasy';
import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { MongoModel } from '@tablerise/database-management';
import { User } from 'src/schemas/user/usersValidationSchema';
import { Logger } from 'src/types/Logger';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { JWTResponsePayload } from 'src/types/Response';

export default class AuthorizationMiddleware {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger
    ) {
        this.checkAdminRole = this.checkAdminRole.bind(this);
        this.twoFactor = this.twoFactor.bind(this);
    }

    public async checkAdminRole(req: Request, _res: Response, next: NextFunction): Promise<void> {
        // this._logger('warn', 'Request to check role');

        const { userId } = req.user as JWTResponsePayload;

        const [userDetails] = await this._modelDetails.findAll({ userId });

        if (process.env.NODE_ENV === 'test') return next();

        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        if (userDetails.role === 'admin') {
            next();
        } else {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(req: Request, _res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'Request to validate two factor token');

        const { id } = req.params;
        const { token } = req.query;

        const user = (await this._model.findOne(id)) as User;

        if (!user) HttpRequestErrors.throwError('user-inexistent');
        if (!user.twoFactorSecret) {
            next();
            return;
        }
        if (typeof token !== 'string') HttpRequestErrors.throwError('query-string-incorrect');

        if (user.twoFactorSecret.qrcode) {
            delete user.twoFactorSecret.qrcode;
            await this._model.update(user._id as string, user);
        }

        const validateSecret = speakeasy.totp.verify({
            secret: user.twoFactorSecret.secret as string,
            encoding: 'base32',
            token,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        next();
    }
}
