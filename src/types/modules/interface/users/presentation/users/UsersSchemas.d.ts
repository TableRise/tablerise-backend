import { ISchemaProps } from 'src/types/shared/configs';

export interface IUsersSchemas {
    getUserByNicknameAndTag: ISchemaProps;
    postValidateEmailSendCode: ISchemaProps;
    postCreateUser: ISchemaProps;
    postLogin: ISchemaProps;
    postSupportEmail: ISchemaProps;
    postDonate: ISchemaProps;
    postMessage: ISchemaProps;
    postUpdateUserProfilePicture: ISchemaProps;
    putUpdateUser: ISchemaProps;
    putUpdateUserDetails: ISchemaProps;
    postAuthenticateEmail: ISchemaProps;
    postAuthenticate2FA: ISchemaProps;
    patchUpdateEmail: ISchemaProps;
    patchUpdateUserCover: ISchemaProps;
    patchUpdatePassword: ISchemaProps;
    patchUpdateCampaignNotes: ISchemaProps;
    patchAcceptFriend: ISchemaProps;
}
