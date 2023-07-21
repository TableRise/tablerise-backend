import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default (response: Internacional<any> | null, className: string, id: string): void => {
  if (!response) {
    const err = new Error(`NotFound a ${className} with provided ID ${id}`);
    err.stack = HttpStatusCode.NOT_FOUND.toString();
    err.name = 'NotFound'

    throw err;
  }
}
