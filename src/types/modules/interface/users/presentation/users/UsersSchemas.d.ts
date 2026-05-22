import { ISchemaProps } from 'src/types/shared/configs';

export interface IUsersSchemas {
    postValidateEmailSendCode: ISchemaProps;
    postCreateUser: ISchemaProps;
    postLogin: ISchemaProps;
    postUpdateUserProfilePicture: ISchemaProps;
    putUpdateUser: ISchemaProps;
    putUpdateUserDetails: ISchemaProps;
    postAuthenticateEmail: ISchemaProps;
    postAuthenticate2FA: ISchemaProps;
    patchUpdateEmail: ISchemaProps;
    patchUpdatePassword: ISchemaProps;
    patchAddUserGameInfo: ISchemaProps;
    patchRemoveUserGameInfo: ISchemaProps;
    patchUpdateCampaignNotes: ISchemaProps;
}
