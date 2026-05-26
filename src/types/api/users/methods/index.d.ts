import User, { UserDetail, GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';
import { InProgressStatus } from 'src/domains/users/enums/InProgressStatusEnum';

export interface UpdateTimestampPayload {
    userId?: string;
    userDetailId?: string;
    campaignId?: string;
    characterId?: string;
}

export interface __UserWithID {
    userId: string;
    user: User;
    userDetails: UserDetail;
}

export interface UserGameInfoDoneResponse {
    campaigns: GameInfoCampaigns[] | any[];
    characters: string[];
    badges: string[];
    charactersCreatedAmount: number;
    campaignsJoinedAmount: number;
    campaignsCreatedAmount: number;
    campaignsClosedAmount: number;
    equipBoughtAmount: number;
}

export interface __FullUserPayload {
    user: UserPayload;
    userDetails: UserDetailPayload;
}

export interface UpdateGameInfoProcessPayload {
    infoId: string;
    targetInfo: 'campaigns' | 'badges' | 'characters';
    data: GameInfoCampaigns | any;
    gameInfo: {
        campaigns: GameInfoCampaigns[] | any[];
        characters: string[];
        badges: string[];
        charactersCreatedAmount: number;
        campaignsJoinedAmount: number;
        campaignsCreatedAmount: number;
        campaignsClosedAmount: number;
        equipBoughtAmount: number;
    };
}

export interface RegisterUserResponsePromise extends User {
    details: Promise<UserDetail>;
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
    status: InProgressStatus;
    iat?: number;
    exp?: number;
}

export interface __FullUser {
    user: User;
    userDetails: UserDetail;
}

export interface __UserEnriched {
    userEnriched: User;
    userDetailsEnriched: UserDetail;
}

export interface __UserSerialized {
    userSerialized: User;
    userDetailsSerialized: UserDetail;
}

export interface __TokenObject {
    token: string;
    user: User;
}

export interface __UserSaved {
    userSaved: User;
    userDetailsSaved: UserDetail;
}

export interface UpdateMatchPlayersResponse {
    campaign: Campaign;
    userDetails: UserDetail;
}
