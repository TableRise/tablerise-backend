import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';

export interface UserPayload {
    user: User;
    userDetails: UserDetail;
}

export interface __UserSerialized {
    userSerialized: User;
    userDetailsSerialized: UserDetail;
}

export interface __UserSaved {
    userSaved: User;
    userDetailsSaved: UserDetail;
}
