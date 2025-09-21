interface ISchemaReturns {
    body?: any;
    params?: any;
    query?: any;
    example: any;
}

export interface IUsersSchemas {
    postValidateEmailSendCode: ISchemaReturns;
    postCreateUser: ISchemaReturns;
    postLogin: ISchemaReturns;
    postUpdateUserProfilePicture: ISchemaReturns;
    putUpdateUser: ISchemaReturns;
    postAuthenticateEmail: ISchemaReturns;
    postAuthenticate2FA: ISchemaReturns;
    postAuthenticateSecretQuestion: ISchemaReturns;
    patchActivateSecretQuestion: ISchemaReturns;
    patchSecretQuestionUpdate: ISchemaReturns;
    patchUpdateEmail: ISchemaReturns;
    patchUpdatePassword: ISchemaReturns;
    patchUpdateUserGameInfo: ISchemaReturns;
}
