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

const [{ email, password, nickname, picture }] = generateUsersJSON();
const [{ firstName, lastName, pronoun, birthday, biography }] = generateUserDetailsJSON();

const mocks = {
    loginMock: { email, password },
    completeUserMock: {
        nickname,
        picture,
        firstName,
        lastName,
        pronoun,
        birthday,
        biography,
    },
};

export default {
    generateUsersJSON,
    generateUserDetailsJSON,
    mocks,
};
