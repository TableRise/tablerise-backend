import { ZodObject } from 'zod';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { LoggerType } from 'src/types/LoggerType';
<<<<<<< HEAD
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
=======
>>>>>>> db0a77bd4d1a976425556db0343feec79afc70c9
import getErrorName from './getErrorName';

export default class ValidateData {
    entry: (zodSchema: ZodObject<any>, payload: unknown) => void;
    existance: (payload: boolean | null | undefined, errorMessage: string) => void;

    constructor(private readonly _logger: LoggerType) {
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

    protected validateEntry(zodSchema: ZodObject<any>, payload: unknown): void {
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
