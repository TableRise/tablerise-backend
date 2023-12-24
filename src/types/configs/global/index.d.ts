declare const expect: Chai;

declare namespace Express {
    export interface Request {
       token?: string
    }
 }
