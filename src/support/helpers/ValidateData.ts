import { ZodObject } from 'zod';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';
import { System } from 'src/schemas/systemValidationSchema';
import getErrorName from './getErrorName';

export default class ValidateData {
    entry: (zodSchema: ZodObject<any>, payload: unknown) => void;
    response: (response: System | Internacional<any> | null, errorMessage: string) => void;
    existance: (payload: boolean | null | undefined, errorMessage: string) => void;
    // systemResponse: (response: any, errorMessage: string) => System | Internacional<any>;
    systemActive: (activeStatus: any, code: number, errorMessage: string) => void;
    systemEntityQuery: (entityQuery: string, errorMessage: string) => void;

    constructor(private readonly _logger: LoggerType) {
        this.entry = this.validateEntry;
        this.response = this.validateResponse;
        this.existance = this.validateExistance;
        // this.systemResponse = this.validateSystemResponse;
        this.systemActive = this.validateSystemActive;
        this.systemEntityQuery = this.validateSystemQuery;
    }

    private _generateError(code: number, errorMessage: string): Error {
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

    protected validateResponse(response: Internacional<any> | System | null, errorMessage: string): void {
        if (!response) {
            throw this._generateError(HttpStatusCode.NOT_FOUND, errorMessage);
        }
    }

    protected validateSystemActive(activeStatus: any, code: number, errorMessage: string): void {
        if (activeStatus) {
            throw this._generateError(code, errorMessage);
        }
    }

    protected validateSystemQuery(entityQuery: string, errorMessage: string): void {
        if (!entityQuery) {
            throw this._generateError(HttpStatusCode.UNPROCESSABLE_ENTITY, errorMessage);
        }
    }
}
