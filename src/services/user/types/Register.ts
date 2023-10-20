import { UserDetail } from 'src/interface/users/schemas/userDetailsValidationSchema';
import { User } from 'src/interface/users/schemas/usersValidationSchema';

export interface FullUser {
    user: User;
    userDetails: UserDetail;
}

export interface __UserEnriched {
    userEnriched: User;
    userDetailsEnriched: UserDetail;
}

export interface __UserSerialized {
    userSerialized: User;
    userDetailsSerialized: UserDetail;
}

export interface __UserSaved {
    userSaved: User;
    userDetailsSaved: UserDetail;
}
