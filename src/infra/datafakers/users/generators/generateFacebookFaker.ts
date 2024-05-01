import Facebook from 'passport-facebook';
import { FacebookJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import newUUID from 'src/domains/common/helpers/newUUID';
import dataGenerator from '../dataGenerator';

function createFacebookProfileFaker({
    id = newUUID(),
}: Facebook.Profile): Facebook.Profile {
    return {
        id,
        provider: 'facebook',
        displayName: dataGenerator.nickname(),
        birthday: dataGenerator.birthday().toISOString(),
        _raw: '',
        _json: {},
    } as Facebook.Profile;
}

export default function generateFacebookProfileFaker({
    count,
    id,
}: FacebookJSONPayload): Facebook.Profile[] {
    const profiles: Facebook.Profile[] = [];

    for (let index = 0; index <= count; index += 1) {
        profiles.push(createFacebookProfileFaker({ id } as Facebook.Profile));
    }

    return profiles;
}
