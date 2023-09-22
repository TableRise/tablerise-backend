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
