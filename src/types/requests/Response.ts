import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';

export default interface UpdateResponse {
    message: string;
    name: string;
}

export interface RegisterUserResponse extends UserInstance {
    details: UserDetailInstance;
}

export interface ConfirmCodeResponse {
    status: string;
}

export interface LoginResponse {
    token: string;
}

export interface JWTResponse {
    userId: string;
    providerId: string | null;
    username: string;
    iat: number;
    exp: number;
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

export interface __UserSaved {
    userSaved: UserInstance;
    userDetailsSaved: UserDetailInstance;
}

export interface TwoFactorResponse {
    qrcode: string;
    active: boolean;
}

export interface UserGameInfoDoneResponse {
    campaigns: string[];
    characters: string[];
    badges: string[];
}
