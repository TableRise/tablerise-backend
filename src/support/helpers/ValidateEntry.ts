import { ZodIssue, ZodObject } from 'zod';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default class ValidateEntry {
  private _throwError (message: ZodIssue[], code: number): void {
    const error = new Error(JSON.stringify(message));
    error.stack = code.toString();
    error.name = 'ValidationError';

    throw error;
  }

  public validate (zodSchema: ZodObject<any>, payload: unknown): void {
    const verify = zodSchema.safeParse(payload);
    if (!verify.success) {
      this._throwError(verify.error.issues, HttpStatusCode.UNPROCESSABLE_ENTITY)
    }
  }
};
