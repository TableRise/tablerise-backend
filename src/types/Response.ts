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
    inProgress: { status: 'wait_to_confirm' | 'wait_to_complete' | 'done'; code: string };
    details: UserDetail;
}

export interface ConfirmCodeResponse {
    status: string;
}

export interface LoginResponse {
    token: string;
}
