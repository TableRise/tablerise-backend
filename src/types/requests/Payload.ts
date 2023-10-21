import { UserDetailPayload } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserPayload } from 'src/domains/user/schemas/usersValidationSchema';

export interface UserExternal {
    providerId: string;
    email: string;
    name: string;
}

export interface emailUpdatePayload {
    email: string;
}

export interface RegisterUserPayload extends UserPayload {
    details: UserDetailPayload;
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
