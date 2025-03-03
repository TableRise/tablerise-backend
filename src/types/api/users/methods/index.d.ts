import { GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';

export interface UpdateTimestampPayload {
    userId?: string;
    userDetailId?: string;
    campaignId?: string;
}

export interface __UserWithID {
    userId: string;
    user: UserInstance;
    userDetails: UserDetailInstance;
}

export interface UserGameInfoDoneResponse {
    campaigns: GameInfoCampaigns[] | any[];
    characters: string[];
    badges: string[];
}

export interface __FullUserPayload {
    user: UserPayload;
    userDetails: UserDetailPayload;
}

export interface UpdateGameInfoProcessPayload {
    infoId: string;
    targetInfo: 'campaigns' | 'badges' | 'characters';
    data: GameInfoCampaigns | any,
    gameInfo: {
        campaigns: GameInfoCampaigns[] | any[];
        characters: string[];
        badges: string[];
    };
}

export interface RegisterUserResponsePromise extends UserInstance {
    details: Promise<UserDetailInstance>;
}

export interface JWTResponse {
    userId: string;
    providerId: string | null;
    username: string;
    picture: {
        link: string;
        id: string;
        uploadDate: Date;
    } | null;
    fullname: string;
    iat?: number;
    exp?: number;
}

export interface __FullUser {
    user: UserInstance;
    userDetails: UserDetailInstance;
}

export interface __UserEnriched {
    userEnriched: UserInstance;
    userDetailsEnriched: UserDetailInstance;
}

export interface __UserSerialized {
    userSerialized: UserInstance;
    userDetailsSerialized: UserDetailInstance;
}

export interface __TokenObject {
    token: string;
}

export interface __UserSaved {
    userSaved: UserInstance;
    userDetailsSaved: UserDetailInstance;
}

export interface UpdateMatchPlayersResponse {
    campaign: CampaignInstance;
    userDetails: UserDetailInstance;
}
