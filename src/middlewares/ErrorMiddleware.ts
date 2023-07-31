import { NextFunction, Request, Response } from 'express';
const logger = require('@tablerise/dynamic-logger');

function ErrorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
    logger('error', 'error http throwed');
    if (!Number(err.stack)) return res.status(500).send(err.message);
    return res.status(Number(err.stack)).json({
        name: err.name,
        message: err.message,
    });
}

export default ErrorMiddleware;
