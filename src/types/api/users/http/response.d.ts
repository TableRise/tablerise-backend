import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

export default interface UpdateResponse {
    message: string;
    name: string;
}

export interface RegisterUserResponse extends UserInstance {
    details: UserDetailInstance;
}

export interface ConfirmEmailResponse {
    status: string;
}

export interface LoginResponse {
    token: string;
}

export interface TwoFactorResponse {
    qrcode: string;
    active: boolean;
}
