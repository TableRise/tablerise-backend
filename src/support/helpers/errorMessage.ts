
/* eslint-disable @typescript-eslint/ban-ts-comment */
export enum ErrorMessage {
    // @ts-expect-error
    CONFLICT =  (query: any) : string => (` ${query ? 'Entity already enabled' : 'Entity already disabled'} `),
    NOT_FOUND_BY_ID = 'notFound an object with providedID',
    BAD_REQUEST = 'Not possible to change availability through this route',
    FORBIDDEN = 'Update the content directly is not allowed',
    UNPROCESSABLE_ENTITY = 'An entity name is required',
}
