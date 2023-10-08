import speakeasy from 'speakeasy';
import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import logger from '@tablerise/dynamic-logger';
import DatabaseManagement from '@tablerise/database-management';
import { User } from 'src/schemas/user/usersValidationSchema';

const database = new DatabaseManagement();
export const modelUser = database.modelInstance('user', 'Users');

export default async function TwoFactorMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
    logger('warn', 'Request to validate two factor token');

    const { id } = req.params;
    const { code } = req.query;

    const user = (await modelUser.findOne(id)) as User;

    if (!user) HttpRequestErrors.throwError('user');
    if (!user.twoFactorSecret) {
        next();
        return;
    }
    if (typeof code !== 'string') HttpRequestErrors.throwError('query-string');

    if (user.twoFactorSecret.qrcode) {
        delete user.twoFactorSecret.qrcode;
        await modelUser.update(user._id as string, user);
    }

    const validateSecret = speakeasy.totp.verify({
        secret: user.twoFactorSecret.code as string,
        encoding: 'base32',
        token: code as string,
    });

    if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

    next();
}
