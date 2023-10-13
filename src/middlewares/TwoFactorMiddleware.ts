import speakeasy from 'speakeasy';
import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { MongoModel } from '@tablerise/database-management';
import { User } from 'src/schemas/user/usersValidationSchema';
import { Logger } from 'src/types/Logger';

export default class TwoFactorMiddleware {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _logger: Logger
    ) {
        this.authenticate = this.authenticate.bind(this);
    }

    public async authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
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
            token: token as string,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        next();
    }
}
