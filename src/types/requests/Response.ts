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
