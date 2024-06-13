import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

export default function AccessHeadersMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { accesskey } = req.headers;

    if (process.env.NODE_ENV !== 'production') {
        next();
        return;
    }

    if (!accesskey || accesskey !== process.env.ACCESS_KEY_SECRET)
        throw new HttpRequestErrors({
            message: 'Access key incorrect or missing',
            code: HttpStatusCode.FORBIDDEN,
            name: getErrorName(HttpStatusCode.FORBIDDEN),
        });

    next();
}
