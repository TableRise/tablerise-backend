import { UserExternalSerialize } from 'src/types/Serializer';
import Google from 'passport-google-oauth20';
import Facebook from 'passport-facebook';
import Discord from 'passport-discord';
import { User } from 'src/schemas/user/usersValidationSchema';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';

export default function userExternalSerializer(
    userProfile: Google.Profile | Facebook.Profile | Discord.Profile
): UserExternalSerialize {
    const user: UserExternalSerialize = {
        providerId: userProfile.id,
        email: '',
        name: '',
    };

    if (isDiscordProfile(userProfile)) {
        user.name = userProfile.username;
        user.email = userProfile.email as string;
    } else if (isGoogleProfile(userProfile) || isFacebookProfile(userProfile)) {
        user.name = userProfile.displayName;
        user.email = userProfile._json.email;
    }

    return user;
}

function isDiscordProfile(obj: any): obj is Discord.Profile {
    return 'provider' in obj && obj.provider === 'discord';
}

function isGoogleProfile(obj: any): obj is Google.Profile {
    return 'provider' in obj && obj.provider === 'google';
}

function isFacebookProfile(obj: any): obj is Facebook.Profile {
    return 'provider' in obj && obj.provider === 'facebook';
}

export function postUserSerializer({
    providerId = null,
    email = null,
    password = null,
    nickname = null,
    tag = null,
    picture = null,
    twoFactorSecret = null,
    createdAt = null,
    updatedAt = null,
}: any): User {
    return {
        providerId,
        email,
        password,
        nickname,
        tag,
        picture,
        twoFactorSecret,
        createdAt,
        updatedAt,
    };
}

export function postUserDetailsSerializer({
    userId = null,
    firstName = null,
    lastName = null,
    pronoun = null,
    secretQuestion = null,
    birthday = null,
    gameInfo = { campaigns: [], characters: [], badges: [] },
    biography = null,
    role = 'user',
}: any): UserDetail {
    return {
        userId,
        firstName,
        lastName,
        pronoun,
        secretQuestion,
        birthday,
        gameInfo,
        biography,
        role,
    };
}

export function putUserSerializer(
    {
        providerId = null,
        email = null,
        password = null,
        nickname = null,
        tag = null,
        picture = null,
        twoFactorSecret = null,
        createdAt = null,
        updatedAt = null,
    }: any,
    user: User
): User {
    return {
        providerId: providerId || user.providerId,
        email: email || user.email,
        password: password || user.password,
        nickname: nickname || user.nickname,
        tag: tag || user.tag,
        picture: picture || user.picture,
        twoFactorSecret: twoFactorSecret || user.twoFactorSecret,
        createdAt: createdAt || user.createdAt,
        updatedAt: updatedAt || user.updatedAt,
    };
}

export function putUserDetailsSerializer(
    {
        userId = null,
        firstName = null,
        lastName = null,
        pronoun = null,
        secretQuestion = null,
        birthday = null,
        gameInfo = null,
        biography = null,
        role = 'user',
    }: any,
    userDetail: UserDetail
): UserDetail {
    return {
        userId: userId || userDetail.userId,
        firstName: firstName || userDetail.firstName,
        lastName: lastName || userDetail.lastName,
        pronoun: pronoun || userDetail.pronoun,
        secretQuestion: secretQuestion || userDetail.secretQuestion,
        birthday: birthday || userDetail.birthday,
        gameInfo: gameInfo || userDetail.gameInfo,
        biography: biography || userDetail.biography,
        role,
    };
}
