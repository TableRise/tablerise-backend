import { NextFunction, Request, Response } from 'express';
import multer, { Multer } from 'multer';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const TEN_MB_LIMIT = 10485760;
const ALLOWED_EXT = ['png', 'jpg', 'jpeg'];

export default class ImageMiddleware {
    private readonly logger;

    constructor({ logger }: InterfaceDependencies['imageMiddlewareContract']) {
        this.logger = logger;

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
        const callName = `[${this.constructor.name}] - ${this.fileType.name}`;
        this.logger('info', callName);

        const files: Express.Multer.File[] = [];

        if (req.file) {
            files.push(req.file);
        }

        if (req.files) {
            if (Array.isArray(req.files)) {
                files.push(...req.files);
            } else {
                Object.values(req.files).forEach((fieldFiles) => files.push(...fieldFiles));
            }
        }

        if (files.length === 0) {
            next();
            return;
        }

        req.body = req.body ?? {};

        if (req.file) {
            req.body[req.file.fieldname] = req.file;
        }

        if (req.files) {
            if (Array.isArray(req.files)) {
                const filesByField = req.files.reduce<Record<string, Express.Multer.File[]>>((acc, file) => {
                    acc[file.fieldname] ??= [];
                    acc[file.fieldname].push(file);
                    return acc;
                }, {});

                Object.assign(req.body, filesByField);
            } else {
                Object.assign(req.body, req.files);
            }
        }

        for (const file of files) {
            const extension = file.mimetype.split('/').pop();
            if (!ALLOWED_EXT.includes(extension as string))
                throw new HttpRequestErrors({
                    message: `File extension is not allowed, valid extensions are: [png, jpg, jpeg]`,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                    code: HttpStatusCode.BAD_REQUEST,
                });
        }

        next();
    }
}
