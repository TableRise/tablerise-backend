import { User, UserDetail } from '@tablerise/database-management';

export interface RegisterUserPayload {
    email: string;
    password: string;
    nickname: string;
    picture: string;
    details: UserDetail;
}

export interface RegisterUserResponse extends User {
    details: UserDetail;
}
