import Google from 'passport-google-oauth20';
import { GoogleJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import newUUID from 'src/domains/common/helpers/newUUID';
import dataGenerator from '../dataGenerator';

function createGoogleProfileFaker({ id = newUUID() }: Google.Profile): Google.Profile {
    return {
        id,
        profileUrl: 'https://google.com/profile',
        provider: 'google',
        displayName: 'faker',
        emails: [{ value: dataGenerator.email(), verified: 'true' }],
        _raw: '',
        _json: {},
    } as Google.Profile;
}

export default function generateGoogleProfileFaker({
    count,
    id,
}: GoogleJSONPayload): Google.Profile[] {
    const profiles: Google.Profile[] = [];

    for (let index = 0; index <= count; index += 1) {
        profiles.push(createGoogleProfileFaker({ id } as Google.Profile));
    }

    return profiles;
}
