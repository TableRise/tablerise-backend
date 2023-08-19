import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import getErrorName from './getErrorName';

export default class ValidateData {
    entry: (zodSchema: any, payload: unknown) => void;
    existance: (payload: boolean | null | undefined, errorMessage: string) => void;

    constructor(private readonly _logger: Logger) {
        this.entry = this.validateEntry;
        this.existance = this.validateExistance;
    }

    public _generateError(code: number, errorMessage: string): Error {
        const error = new Error(errorMessage);
        error.stack = code.toString();
        error.name = getErrorName(code);

        this._logger('error', errorMessage);

        return error;
    }

    protected validateEntry(zodSchema: any, payload: unknown): void {
        const verify = zodSchema.safeParse(payload);
        if (!verify.success) {
            const errorMessage = JSON.stringify(verify.error.issues);
            throw this._generateError(HttpStatusCode.UNPROCESSABLE_ENTITY, errorMessage);
        }
    }

    protected validateExistance(noQueryOrActiveProperty: boolean | undefined | null, errorMessage: string): void {
        if (noQueryOrActiveProperty) {
            throw this._generateError(HttpStatusCode.BAD_REQUEST, errorMessage);
        }
    }
}
