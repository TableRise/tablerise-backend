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
    | 'email-already-exist'
    | 'tag-already-exist'
    | 'user-inexistent'
    | '2fa-no-active'
    | '2fa-already-active'
    | '2fa-incorrect'
    | 'rpg-not-found-id'
    | 'query-string-incorrect'
    | 'login'
    | 'linked-mandatory-data-when-delete'
    | 'verification-email-send-fail'
    | 'invalid-user-status';
