import { UserSerialize } from 'src/types/Serializer';
import Google from 'passport-google-oauth20';
import Facebook from 'passport-facebook';
import Discord from 'passport-discord';
import { User } from 'src/schemas/user/usersValidationSchema';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';

export default function userSerializer(
    userProfile: Google.Profile | Facebook.Profile | Discord.Profile
): UserSerialize {
    const user: UserSerialize = {
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
