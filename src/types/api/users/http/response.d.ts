import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { CookieOptions } from 'express';
import { JWTResponse } from '../methods';

export default interface UpdateResponse {
    message: string;
    name: string;
}

export interface RegisterUserResponse extends User {
    details: UserDetail;
    token?: string;
}

export interface CompleteUserResponse {
    user: User;
    details: UserDetail;
}

export interface ConfirmEmailResponse {
    status: string;
}

export interface LoginResponse {
    tokenData: JWTResponse;
    cookieOptions: CookieOptions;
}

export interface TwoFactorResponse {
    qrcode: string;
    active: boolean;
}
