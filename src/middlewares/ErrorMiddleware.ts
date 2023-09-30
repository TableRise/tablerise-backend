import { NextFunction, Request, Response } from 'express';
import logger from '@tablerise/dynamic-logger';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

function ErrorMiddleware(err: HttpRequestErrors | Error, _req: Request, res: Response, _next: NextFunction): Response {
    if (!(err instanceof HttpRequestErrors)) {
        logger('error', `error internal throwed - code: 500 [ ${err.name} ]`);
        return res.status(500).send(err.message);
    }

    return res.status(err.code).json({
        ...err,
        message: err.message,
    });
}

export default ErrorMiddleware;
