import logger from '@tablerise/dynamic-logger';
import { ErrorDetails, Errors } from 'src/types/Errors';

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
}
