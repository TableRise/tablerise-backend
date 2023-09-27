import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';

export interface RegisterUserPayload {
    providerId?: string;
    email: string;
    password: string;
    nickname: string;
    picture: string;
    details: UserDetail;
}

export interface RegisterUserResponse extends User {
    inProgress: { status: 'wait_to_confirm' | 'wait_to_complete'; code: number };
    details: UserDetail;
}

export interface LoginResponse {
    token: string;
}
