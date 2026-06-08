import { CompleteOAuthPayload } from 'src/domains/users/schemas/oAuthValidationSchema';
import { FileObject } from 'src/types/shared/file';
import User, { GameInfoCampaigns, UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export interface UserExternal {
    providerId: string;
    email: string;
    name: string;
}

export interface GetByIdPayload {
    userId: string;
}

export interface GetByNicknameAndTagPayload {
    nickname: string;
    tag: string;
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
    image?: FileObject;
    imageObject?: ImageObject;
}

export interface UpdateUserCoverPayload {
    userId: string;
    image?: FileObject;
    imageObject?: ImageObject;
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

export interface CreateMessagePayload {
    senderId: string;
    targetUserId: string;
    title: string;
    content: string;
}

export interface MessageLookupPayload {
    userId: string;
    messageId: string;
}

export interface GalleryLookupPayload {
    userId: string;
    imageId: string;
}

export interface FriendLookupPayload {
    userId: string;
    targetUserId: string;
}

export interface AnswerFriendRequestPayload extends FriendLookupPayload {
    decline?: boolean | string;
}

export type MessageStatus = 'not-read' | 'read';
export type UserMessage = Omit<UserDetail['messages'][number], 'status'> & {
    status: MessageStatus;
};
export type UserGalleryItem = ImageObject;
export type UserFriend = UserDetail['friends'][number];
