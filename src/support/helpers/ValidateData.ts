import { ZodIssue, ZodObject } from 'zod';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

export default class ValidateData {
    validator: (zodSchema: ZodObject<any>, payload: unknown) => void;
    validatorResponse: (response: Internacional<any>, serviceClassName: string) => Internacional<any>;

    constructor() {
        this.validator = this.validate;
        this.validatorResponse = this.validateResponse;
    }

    private _throwError(message: ZodIssue[], code: number): void {
        if (message[0].path.includes('content')) return;

        const error = new Error(JSON.stringify(message));
        error.stack = code.toString();
        error.name = 'ValidationError';

        throw error;
    }

    protected validate(zodSchema: ZodObject<any>, payload: unknown): void {
        const verify = zodSchema.safeParse(payload);
        if (!verify.success) {
            this._throwError(verify.error.issues, HttpStatusCode.UNPROCESSABLE_ENTITY);
        }
    }

    protected validateResponse(response: Internacional<any> | null, serviceClassName: string): Internacional<any> {
        if (!response) {
            const err = new Error(`NotFound a ${serviceClassName} with provided ID`);
            err.stack = HttpStatusCode.NOT_FOUND.toString();
            err.name = 'NotFound';
            console.log('L36 >>>>', err)
            throw err;
        }

        return response;

    }
}
