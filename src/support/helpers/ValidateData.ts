import { DnDSystem, Internacional } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import getErrorName from './getErrorName';

export default class ValidateData {
    entry: (zodSchema: any, payload: unknown) => void;
    response: (response: null | Internacional<any>, errorMessage: string) => Internacional<any>;
    active: (payload: boolean | undefined | null, errorMessage: string) => void;
    systemResponse: (response: any, errorMessage: string) => DnDSystem & { _id: string };
    systemActive: (activeStatus: any, code: number, errorMessage: string) => void;
    systemEntityQuery: (entityQuery: string, errorMessage: string) => void;

    constructor(
        private readonly _logger: Logger
    ) {
        this.entry = this.validateEntry;
        this.response = this.validateResponse;
        this.active = this.validateActive;
        this.systemResponse = this.validateSystemResponse;
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

    protected validateEntry(zodSchema: any, payload: unknown): void {
        const verify = zodSchema.safeParse(payload);
        if (!verify.success) {
            const errorMessage = JSON.stringify(verify.error.issues);
            throw this._generateError(HttpStatusCode.UNPROCESSABLE_ENTITY, errorMessage);
        }
    }

    protected validateResponse(response: Internacional<any> | any, errorMessage: string): Internacional<any> {
        if (!response) {
            throw this._generateError(HttpStatusCode.NOT_FOUND, errorMessage);
        }
        return response;
    }

    protected validateActive(activeStatus: boolean | undefined | null, errorMessage: string): void {
        if (activeStatus) {
            throw this._generateError(HttpStatusCode.BAD_REQUEST, errorMessage);
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

    protected validateSystemResponse(response: any, errorMessage: string): DnDSystem & { _id: string } {
        if (!response) {
            throw this._generateError(HttpStatusCode.NOT_FOUND, errorMessage);
        }
        return response;
    }
}
