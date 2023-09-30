import { mongoose } from '@tablerise/database-management';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import logger from '@tablerise/dynamic-logger';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

export default function VerifyIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const { id } = req.params;

    const isValidMongoID = mongoose.isValidObjectId(id);

    if (!isValidMongoID) {
        throw new HttpRequestErrors({
            message: 'The parameter id is invalid',
            code: HttpStatusCode.BAD_REQUEST,
            name: 'Invalid Entry',
        });
    }

    logger('info', 'The parameter id is valid');
    next();
}
