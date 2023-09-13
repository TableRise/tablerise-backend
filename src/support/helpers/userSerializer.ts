import { User } from 'src/types/User';

export default function userSerializer(userProfile: any): User {
    const user: User = {
        external_id: userProfile.id,
        email: '',
        name: '',
    };

    if (userProfile.provider === 'discord') {
        user.name = userProfile.username;
        user.email = userProfile.email;
    } else {
        user.name = userProfile.displayName;
        user.email = userProfile._json.email;
    }

    return user;
}
