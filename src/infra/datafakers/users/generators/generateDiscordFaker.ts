import Discord from 'passport-discord';
import { DiscordJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import dataGenerator from '../dataGenerator';

function createDiscordProfileFaker({
    username = dataGenerator.nickname(),
}: Discord.Profile): Discord.Profile {
    return {
        provider: 'discord',
        username,
        locale: 'PT-BR',
        mfa_enabled: false,
        flags: 10,
        banner: null,
        accent_color: null,
        avatar: null,
        discriminator: 'no-d',
        verified: true,
        fetchedAt: '2024-04-27Z22:29:00',
    } as Discord.Profile;
}

export default function generateDiscordProfileFaker({
    count,
    username,
}: DiscordJSONPayload): Discord.Profile[] {
    const profiles: Discord.Profile[] = [];

    for (let index = 0; index <= count; index += 1) {
        profiles.push(createDiscordProfileFaker({ username } as Discord.Profile));
    }

    return profiles;
}
