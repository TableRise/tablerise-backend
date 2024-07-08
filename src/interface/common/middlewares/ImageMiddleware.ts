import { NextFunction, Request, Response } from 'express';
import multer, { Multer } from 'multer';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const TEN_MB_LIMIT = 10485760;
const ALLOWED_EXT = ['png', 'jpg', 'jpeg'];

export default class ImageMiddleware {
    private readonly _logger;

    constructor({ logger }: InterfaceDependencies['imageMiddlewareContract']) {
        this._logger = logger;

        this.fileType = this.fileType.bind(this);
    }

    public multer(): Multer {
        const limits = {
            fileSize: TEN_MB_LIMIT,
        };

        const storage = multer.memoryStorage();
        return multer({
            storage,
            limits,
        });
    }

    public fileType(req: Request, res: Response, next: NextFunction): void {
        this._logger('info', 'FileType - ImageMiddleware');
        const file = req.file;
        if (!file) {
            next();
            return;
        }
        const extension = file.mimetype.split('/').pop();
        if (!ALLOWED_EXT.includes(extension as string))
            throw new HttpRequestErrors({
                message: `File extension is not allowed, valid extensions are: [png, jpg, jpeg]`,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
                code: HttpStatusCode.BAD_REQUEST,
            });

        next();
    }
}
