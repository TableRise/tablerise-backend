import { CompleteOAuthPayload } from 'src/domains/user/schemas/oAuthValidationSchema';
import {
    UserDetailInstance,
    UserDetailPayload,
} from 'src/domains/user/schemas/userDetailsValidationSchema';
import {
    UserInstance,
    UserPayload,
} from 'src/domains/user/schemas/usersValidationSchema';

export interface UserExternal {
    providerId: string;
    email: string;
    name: string;
}

export interface __FullUserPayload {
    user: UserPayload;
    userDetails: UserDetailPayload;
}

export interface CompleteOAuth {
    userId: string;
    payload: CompleteOAuthPayload;
}

export interface emailUpdatePayload {
    email: string;
}

export interface UpdateTimestampPayload {
    userId?: string;
    userDetailId?: string;
}

export interface RegisterUserPayload extends UserPayload {
    details: UserDetailPayload;
}

export interface UpdateUserPayload {
    userId: string;
    payload: RegisterUserPayload;
}

export interface ConfirmCodePayload {
    userId: string;
    code: string;
}

export interface UpdateEmailPayload {
    userId: string;
    code: string;
    email: string;
}

export interface VerifyEmailPayload {
    email: string;
    newEmail: string;
}

export interface ConfirmTokenPayload {
    userId: string;
    token: string;
}

export interface __UserWithID {
    userId: string;
    user: UserInstance;
    userDetails: UserDetailInstance;
}

export interface GetByIdPayload {
    userId: string;
}

export interface UpdateGameInfoPayload {
    userId: string;
    infoId: string;
    targetInfo: 'campaigns' | 'badges' | 'characters';
    operation: 'add' | 'remove';
}

export interface UpdateGameInfoProcessPayload {
    infoId: string;
    targetInfo: 'campaigns' | 'badges' | 'characters';
    gameInfo: {
        campaigns: string[];
        characters: string[];
        badges: string[];
    };
}
