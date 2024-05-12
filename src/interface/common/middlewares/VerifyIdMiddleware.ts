import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import logger from '@tablerise/dynamic-logger';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default function VerifyIdMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const { id } = req.params;

    const isValidUUID =
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    if (!isValidUUID.test(id)) {
        throw new HttpRequestErrors({
            message: 'The parameter id is invalid',
            code: HttpStatusCode.BAD_REQUEST,
            name: 'BadRequest',
        });
    }

    logger('info', 'The parameter id is valid');
    next();
}
