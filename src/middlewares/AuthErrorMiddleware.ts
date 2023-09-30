import { Request, Response } from 'express';
import logger from '@tablerise/dynamic-logger';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';

function AuthErrorMiddleware(_req: Request, res: Response): Response {
    logger('error', `error ocurred during authentication`);
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
        name: 'Unauthorized',
        message: 'Some error ocurred during authentication',
    });
}

export default AuthErrorMiddleware;
