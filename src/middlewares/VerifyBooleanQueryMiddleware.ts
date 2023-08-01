import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default function VerifyBooleanQueryMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const { availability } = req.query;

    if (availability === 'true' || availability === 'false') {
        return next();
    }

    const err = new Error('The query is invalid');
    err.stack = HttpStatusCode.BAD_REQUEST.toString();
    err.name = 'Invalid Entry';

    throw err;
}
