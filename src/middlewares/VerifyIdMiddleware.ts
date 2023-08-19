import { mongoose, MongoModel } from '@tablerise/database-management';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
const logger = require('@tablerise/dynamic-logger');

export default function VerifyIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const { id } = req.params;

    const isValidMongoID = mongoose.isValidObjectId(id);

    if (!isValidMongoID) {
        const err = new Error('The parameter id is invalid');
        err.stack = HttpStatusCode.BAD_REQUEST.toString();
        err.name = 'Invalid Entry';

        logger('error', err.message);
        throw err;
    }

    logger('info', 'The parameter id is valid');
    next();
}
