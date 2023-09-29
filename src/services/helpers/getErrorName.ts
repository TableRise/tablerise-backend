import { HttpStatusCode } from './HttpStatusCode';

export default (code: number): string => {
    switch (code) {
        case HttpStatusCode.NOT_FOUND:
            return 'NotFound';
        case HttpStatusCode.BAD_REQUEST:
            return 'BadRequest';
        case HttpStatusCode.UNPROCESSABLE_ENTITY:
            return 'ValidationError';
        case HttpStatusCode.FORBIDDEN:
            return 'ForbiddenRequest';
        case HttpStatusCode.UNAUTHORIZED:
            return 'Unauthorized';
        default:
            throw new Error(`This ${code} is not valid, check the code List at HttpStatusCode.`);
    }
};
