import { CompleteOAuthPayload } from 'src/domains/users/schemas/oAuthValidationSchema';
import { FileObject } from 'src/types/shared/file';
import User, { GameInfoCampaigns, UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export interface UserExternal {
    providerId: string;
    email: string;
    name: string;
}

export interface GetByIdPayload {
    userId: string;
}

export interface AddGameInfoPayload {
    userId: string;
    infoId: string;
    data: GameInfoCampaigns | any;
    targetInfo: 'campaigns' | 'badges' | 'characters';
}

export interface RemoveGameInfoPayload {
    userId: string;
    infoId: string;
    data: GameInfoCampaigns | any;
    targetInfo: 'campaigns' | 'badges' | 'characters';
}

export interface AddCampaignNotePayload {
    userId: string;
    campaignId: string;
    note: GameInfoCampaigns['notes'][number];
}

export interface PostSupportEmailBodyPayload {
    title: string;
    content: string;
    category: string;
    campaignCode?: string;
}

export interface PostSupportEmailPayload {
    userId: string;
    payload: PostSupportEmailBodyPayload;
}

export interface RegisterDonationBodyPayload {
    value: number;
    timestamp: string;
    nickname?: string;
    userId: string;
}

export interface RegisterDonationPayload {
    userId: string;
    validation: boolean;
    payload: RegisterDonationBodyPayload;
}

export interface UserImagePayload {
    userId: string;
    image: FileObject;
}

export interface UpdateUserCoverPayload {
    userId: string;
    image: FileObject;
}

export interface RemoveUserCoverPayload {
    userId: string;
}

export interface CompleteOAuth {
    userId: string;
    payload: CompleteOAuthPayload;
}

export interface emailUpdatePayload {
    email: string;
}

export interface RegisterUserPayload extends Pick<User, 'email' | 'password' | 'nickname'> {
    details: Pick<UserDetail, 'firstName' | 'lastName' | 'birthday' | 'biography'>;
}

export interface UserUpdateBodyPayload {
    nickname?: string;
}

export interface UserDetailsUpdateBodyPayload {
    firstName?: string;
    lastName?: string;
    birthday?: string;
    biography?: string;
}

export interface UpdateUserPayload {
    userId: string;
    payload: UserUpdateBodyPayload;
}

export interface UpdateUserDetailsPayload {
    userId: string;
    payload: UserDetailsUpdateBodyPayload;
}

export interface ConfirmEmailPayload {
    email: string;
    code: string;
}

export interface UpdateEmailPayload {
    userId: string;
    email: string;
}

export interface UpdatePasswordPayload {
    email: string;
    password: string;
}

export interface VerifyEmailPayload {
    email: string;
    flow: StateMachineFlowKeys;
}
