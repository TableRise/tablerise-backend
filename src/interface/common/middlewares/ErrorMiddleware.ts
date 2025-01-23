import { NextFunction, Request, Response } from 'express';
import logger from '@tablerise/dynamic-logger';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

function ErrorMiddleware(
    err: HttpRequestErrors | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response | undefined {
    if (err.name.includes('Error')) {
        logger('error', `error internal throwed - code: 500 [ ${err.name} ]`);
        return res.status(500).send(err.message);
    }

    const errorToThrow = err as HttpRequestErrors;

    if (errorToThrow.redirectTo) {
        logger(
            'error',
            `error with redirect - redirecting to [ ${errorToThrow.redirectTo} ]`
        );
        const urlToRedirect = process.env.URL_TO_REDIRECT ?? 'http://localhost:3000';
        res.redirect(
            `${urlToRedirect}${errorToThrow.redirectTo}?error=${errorToThrow.message}`
        );
        return;
    }

    return res.status(errorToThrow.code).json({
        ...errorToThrow,
        message: errorToThrow.message,
    });
}

export default ErrorMiddleware;
