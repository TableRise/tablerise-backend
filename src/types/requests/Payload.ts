import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserPayload } from 'src/domains/user/schemas/usersValidationSchema';

export interface emailUpdatePayload {
    email: string;
}

export interface RegisterUserPayload extends UserPayload {
    details: UserDetailInstance;
}
