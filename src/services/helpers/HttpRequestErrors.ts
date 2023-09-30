import logger from '@tablerise/dynamic-logger';
import { ErrorDetails, ErrorTypes, Errors } from 'src/types/Errors';
import { HttpStatusCode } from './HttpStatusCode';
import getErrorName from './getErrorName';

export default class HttpRequestErrors extends Error {
    code: number;
    details: ErrorDetails[];

    constructor({ message, code, details, name }: Errors) {
        logger('error', `${message} - ${code}`);
        super(message);
        this.code = code;
        this.details = details as ErrorDetails[];
        this.name = name as string;
    }

    static throwError(errorType: ErrorTypes): void {
        switch (errorType) {
            case 'email':
                throw new HttpRequestErrors({
                    message: 'Email already exists in database',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });

            case 'tag':
                throw new HttpRequestErrors({
                    message: 'User with this tag already exists in database',
                    code: HttpStatusCode.BAD_REQUEST,
                    name: getErrorName(HttpStatusCode.BAD_REQUEST),
                });
        
            default:
                break;
        }
    }
}
