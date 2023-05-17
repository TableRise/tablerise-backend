import { ZodIssue, ZodObject } from 'zod';
import HttpStatusCode from 'src/helpers/HttpStatusCode';

class ValidateEntry {
  private throwError (message: ZodIssue[], code: number): void {
    const error = new Error(JSON.stringify(message));
    error.stack = code.toString();
    error.name = 'ValidationError';

    throw error;
  }

  protected validate (zodSchema: ZodObject<any>, payload: unknown): void {
    const verify = zodSchema.safeParse(payload);
    if (!verify.success) {
      this.throwError(verify.error.issues, HttpStatusCode.UNPROCESSABLE_ENTITY)
    }
  }
};

export default ValidateEntry;
