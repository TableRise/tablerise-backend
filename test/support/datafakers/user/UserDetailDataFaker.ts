import { UserDetail } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserDetailFaker } from '../GeneralDataFaker';
import utils from '../../utils';

const { newUUID, dataGenerator } = utils;

function createUserDetailFaker({ _id = newUUID() }: UserDetail): UserDetail {
    return {
        _id,
        userId: newUUID(),
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        pronoun: 'she/her',
        secretQuestion: { question: 'What sound does the fox?', answer: 'Kikikikikiu' },
        birthday: dataGenerator.birthday().toISOString(),
        gameInfo: { campaigns: [], characters: [], badges: [] },
        biography: dataGenerator.biography(),
        role: 'user',
    };
}

export function generateUserDetailFaker({ count, _id }: UserDetailFaker): UserDetail[] {
    const users: UserDetail[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserDetailFaker({ _id } as UserDetail));
    }

    return users;
}
