declare const expect: Chai;

declare namespace Express {
    export interface Request {
        token?: string;
    }

    export interface User {
        userId: string;
        providerId: string;
        username: string;
        picture: string;
    }
}
