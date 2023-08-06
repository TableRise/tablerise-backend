import { ZodObject } from 'zod';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import { System } from 'src/schemas/systemValidationSchema';
import getErrorName from './getErrorName';

export default class ValidateData {
    entry: (zodSchema: ZodObject<any>, payload: unknown, errorMessage: string) => void;
    response: (response: null | Internacional<any> , errorMessage: string) => Internacional<any>;
    active: (payload: boolean | undefined | null, errorMessage: string) => void;
    systemResponse: (response: null | System, errorMessage: string) => System | any;

    constructor(private readonly _logger: LoggerType,) {
        this.entry = this.validateEntry;
        this.response = this.validateResponse;
        this.active = this.validateActive;
        this.systemResponse = this.validateSystemResponse;
    }

    private _generateError( code: number, errorMessage: string): Error {

        const error = new Error(errorMessage);
        error.stack = code.toString();
        error.name = getErrorName(code);

        this._logger('error', errorMessage)

        return error;
    }

    protected validateEntry(zodSchema: ZodObject<any>, payload: unknown, errorMessage: string): void {
        const verify = zodSchema.safeParse(payload);
        if (!verify.success) {
            const errorMessage = JSON.stringify(verify.error.issues);
            throw this._generateError(HttpStatusCode.UNPROCESSABLE_ENTITY,  errorMessage);
        }
    }

    protected validateResponse(response: null | Internacional<any> | any, errorMessage: string): Internacional<any> {
        if (!response) {
            throw this._generateError(HttpStatusCode.NOT_FOUND, errorMessage);
        }
        return response;
    }

    protected validateSystemResponse(response: null | System, errorMessage: string): System {
        if (!response) {
            throw this._generateError(HttpStatusCode.NOT_FOUND, errorMessage);
        }
        return response;
    }

    protected validateActive(activeStatus: boolean | undefined | null, errorMessage: string): void {
        if (activeStatus) {
            const err = new Error(errorMessage);
            err.stack = HttpStatusCode.BAD_REQUEST.toString();
            err.name = 'BadRequest';

            this._logger('error', errorMessage)

            throw err;
        }
    }


}
