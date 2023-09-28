import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';

export interface TwoFactorSecret {
    code: string;
    qrcode?: string;
    active?: boolean;
}

export interface RegisterUserPayload {
    providerId?: string;
    email: string;
    password: string;
    nickname: string;
    picture: string;
    twoFactorSecret?: TwoFactorSecret;
    details: UserDetail;
}

export interface RegisterUserResponse extends User {
    inProgress: { status: 'wait_to_confirm' | 'wait_to_complete'; code: number };
    details: UserDetail;
}

export interface LoginResponse {
    token: string;
}
