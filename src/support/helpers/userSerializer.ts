import { UserSerialized } from 'src/types/Serializer';
import Google from 'passport-google-oauth20';
import Facebook from 'passport-facebook';
import Discord from 'passport-discord';

export default function userSerializer(
    userProfile: Google.Profile | Facebook.Profile | Discord.Profile
): UserSerialized {
    const user: UserSerialized = {
        external_id: userProfile.id,
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
