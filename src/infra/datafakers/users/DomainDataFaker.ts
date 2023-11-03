import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import {
    UserDetailJSONPayload,
    UserJSONPayload,
} from 'src/types/users/datafakers/Payload';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import generateUsersFaker from './generators/generateUsersFaker';
import generateUserDetailsFaker from './generators/generateUserDetailsFaker';

function generateUsersJSON(
    { count, userId }: UserJSONPayload = { count: 1 }
): UserInstance[] {
    return generateUsersFaker({ count, userId });
}

function generateUserDetailsJSON(
    { count, userDetailId }: UserDetailJSONPayload = { count: 1 }
): UserDetailInstance[] {
    return generateUserDetailsFaker({ count, userDetailId });
}

const [{ email, password }] = generateUsersJSON();

const mocks = {
    loginMock: { email, password },
};

export default {
    generateUsersJSON,
    generateUserDetailsJSON,
    mocks,
};
