import { ZodObject } from 'zod';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { LoggerType } from 'src/types/LoggerType';

export default class ValidateData {
    entry: (zodSchema: ZodObject<any>, payload: unknown, className: string) => void;
    response: (response: null | Internacional<any>, serviceClassName: string) => Internacional<any>;

    constructor(private readonly _logger: LoggerType,) {
        this.entry = this.validateEntry;
        this.response = this.validateResponse;
    }

    private _throwError(message: string, code: number, className: string): void {

        const error = new Error(message);
        error.stack = code.toString();
        error.name = 'ValidationError';

        this._logger('info', `All ${className} entities found with success`)

        throw error;
    }

    protected validateEntry(zodSchema: ZodObject<any>, payload: unknown, className: string): void {
        const verify = zodSchema.safeParse(payload);
        if (!verify.success) {
            const errorMessage = JSON.stringify(verify.error.issues);
            this._throwError(errorMessage, HttpStatusCode.UNPROCESSABLE_ENTITY, className);
        }
    }

    protected validateResponse(response: null | Internacional<any>, className: string): Internacional<any> 
        {
            if (!response) {
                const err = new Error(`NotFound an ${className} with provided ID`);
                err.stack = HttpStatusCode.NOT_FOUND.toString();
                err.name = 'NotFound';

                this._logger('info', `All ${className} entities found with success`)

                throw err;
            }
            return response;

        }
}
