import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import logger from '@tablerise/dynamic-logger';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import UUIDEnum from 'src/domains/user/enums/UUIDEnum';

export default function VerifyIdMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const { id } = req.params;

    const isValidUUID = new RegExp(UUIDEnum.enum.isValid);

    if (!isValidUUID.test(id)) {
        throw new HttpRequestErrors({
            message: 'The parameter id is invalid',
            code: HttpStatusCode.BAD_REQUEST,
            name: 'Invalid Entry',
        });
    }

    logger('info', 'The parameter id is valid');
    next();
}
