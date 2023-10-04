export interface ErrorDetails {
    attribute: string;
    path: string;
    reason: string;
}

export interface Errors {
    message: string;
    code: number;
    name?: string;
    details?: ErrorDetails[];
}

export type ErrorTypes =
    | 'email'
    | 'tag'
    | 'user'
    | '2fa'
    | '2fa-incorrect'
    | 'rpg-not-found-id'
    | 'query-string'
    | 'login'
    | 'verification-email'
    | 'invalid-user-status';
