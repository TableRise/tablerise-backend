import { ZodError, ZodIssue } from 'zod';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import getErrorName from './getErrorName';
import HttpRequestErrors from './HttpRequestErrors';

export default class SchemaValidator {
    entry: (zodSchema: any, payload: unknown) => void;
    entryReturn: (zodSchema: any, payload: unknown) => ZodError | null;
    existance: (payload: boolean | null | undefined, errorMessage: string) => void;

    constructor() {
        this.entry = this.validateEntry;
        this.existance = this.validateExistance;
        this.entryReturn = this.validateEntryReturn;
    }

    protected validateEntry(zodSchema: any, payload: unknown): void {
        const verify = zodSchema.safeParse(payload);

        if (!verify.success)
            throw new HttpRequestErrors({
                message: 'Schema error',
                code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                name: getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY),
                details: verify.error.issues.map((err: ZodIssue) => ({
                    attribute: err.path.length > 1 ? err.path : err.path[0],
                    reason: err.message,
                    path: 'payload',
                })),
            });
    }

    protected validateEntryReturn(zodSchema: any, payload: unknown): ZodError | null {
        const verify = zodSchema.safeParse(payload);

        if (!verify.success) return verify;
        return null;
    }

    protected validateExistance(
        noQueryOrActiveProperty: boolean | undefined | null,
        errorMessage: string
    ): void {
        if (noQueryOrActiveProperty)
            throw new HttpRequestErrors({
                message: errorMessage,
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
    }
}
