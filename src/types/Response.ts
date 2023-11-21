import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';

export interface TwoFactorSecret {
    secret?: string;
    qrcode?: string;
    active: boolean;
}

export interface RegisterUserPayload {
    providerId?: string;
    email: string;
    password: string;
    nickname: string;
    picture: string;
    twoFactorSecret: TwoFactorSecret;
    details: UserDetail;
}

export interface RegisterUserResponse extends User {
    inProgress: { 
        status: 
            | 'done' 
            | 'email_change'
            | 'wait_to_confirm' 
            | 'wait_to_complete' 
            | 'wait_to_verify' 
            | 'password_change'; 
        code: string };
    details: UserDetail;
}

export interface getUserResponse extends User {
    details: UserDetail;
}

export interface ConfirmCodeResponse {
    status: string;
}

export interface LoginResponse {
    token: string;
}

export interface emailUpdatePayload {
    email: string;
}

export interface JWTResponsePayload {
    userId: string;
    providerId: string | null;
    username: string;
    iat: number;
    exp: number;
}
