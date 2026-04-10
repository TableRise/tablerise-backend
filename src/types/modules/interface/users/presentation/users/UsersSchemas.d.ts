import { ISchemaProps } from 'src/types/shared/configs';

export interface IUsersSchemas {
    postValidateEmailSendCode: ISchemaProps;
    postCreateUser: ISchemaProps;
    postLogin: ISchemaProps;
    postUpdateUserProfilePicture: ISchemaProps;
    putUpdateUser: ISchemaProps;
    postAuthenticateEmail: ISchemaProps;
    postAuthenticate2FA: ISchemaProps;
    postAuthenticateSecretQuestion: ISchemaProps;
    patchActivateSecretQuestion: ISchemaProps;
    patchSecretQuestionUpdate: ISchemaProps;
    patchUpdateEmail: ISchemaProps;
    patchUpdatePassword: ISchemaProps;
    patchUpdateUserGameInfo: ISchemaProps;
}
