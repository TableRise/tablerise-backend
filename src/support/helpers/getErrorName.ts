import { HttpStatusCode } from "./HttpStatusCode"

export default (code: number) : string =>{
    if (code === HttpStatusCode.NOT_FOUND) return 'NotFound';
    if (code === HttpStatusCode.BAD_REQUEST) return 'BadRequest';
    if( code === HttpStatusCode.UNPROCESSABLE_ENTITY || code === HttpStatusCode.BAD_REQUEST) return 'ValidationError';
    if( code === HttpStatusCode.FORBIDDEN)
    throw new Error(`This ${code} is not a valid HttpStatusCode`)
} 