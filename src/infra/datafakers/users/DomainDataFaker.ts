import Discord from 'passport-discord';
import Facebook from 'passport-facebook';
import Google from 'passport-google-oauth20';
import {
    DiscordJSONPayload,
    FacebookJSONPayload,
    GoogleJSONPayload,
    UserDetailJSONPayload,
    UserJSONPayload,
} from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import generateUsersFaker from './generators/generateUsersFaker';
import generateUserDetailsFaker from './generators/generateUserDetailsFaker';
import generateDiscordProfileFaker from './generators/generateDiscordFaker';
import generateFacebookProfileFaker from './generators/generateFacebookFaker';
import generateGoogleProfileFaker from './generators/generateGoogleFaker';

function generateUsersJSON({ count, userId }: UserJSONPayload = { count: 1 }): User[] {
    return generateUsersFaker({ count, userId });
}

function generateUserDetailsJSON({ count, userDetailId }: UserDetailJSONPayload = { count: 1 }): UserDetail[] {
    return generateUserDetailsFaker({ count, userDetailId });
}

function generateDiscordProfileJSON({ count, username }: DiscordJSONPayload = { count: 1 }): Discord.Profile[] {
    return generateDiscordProfileFaker({ count, username });
}

function generateFacebookProfileJSON({ count, id }: FacebookJSONPayload = { count: 1 }): Facebook.Profile[] {
    return generateFacebookProfileFaker({ count, id });
}

function generateGoogleProfileJSON({ count, id }: GoogleJSONPayload = { count: 1 }): Google.Profile[] {
    return generateGoogleProfileFaker({ count, id });
}

const [{ email, password, nickname }] = generateUsersJSON();
const [{ firstName, lastName, birthday, biography }] = generateUserDetailsJSON();

const mocks = {
    loginMock: { email, password },
    createUserMock: {
        email,
        password,
        nickname,
    },
    updateGameInfo: {
        infoId: '123',
        targetInfo: 'campaigns',
        operation: 'add',
        data: {},
    },
    completeUserMock: {
        nickname,
        firstName,
        lastName,
        birthday,
    },
    updateUserMock: {
        nickname,
    },
    updateUserDetailsMock: {
        firstName,
        lastName,
        birthday,
        biography,
    },
    updateEmailMock: { email },
    updatePasswordMock: { password: '@TheWorld456' },
    uploadPicture: { picture: { isBinary: true } },
};

export default {
    generateUsersJSON,
    generateUserDetailsJSON,
    generateDiscordProfileJSON,
    generateFacebookProfileJSON,
    generateGoogleProfileJSON,
    mocks,
};
