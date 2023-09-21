import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default function VerifyBooleanQueryMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const { availability } = req.query;

    if (availability === 'true' || availability === 'false') {
        next();
        return;
    }

    throw new HttpRequestErrors({
        message: 'The query is invalid',
        code: HttpStatusCode.BAD_REQUEST,
        name: 'Invalid Entry'
    });
}
