import { UserDetailInstance, UserDetailPayload } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserDetailFaker } from '../GeneralDataFaker';
import utils from '../../utils';

const { newUUID, dataGenerator } = utils;

function createUserDetailFaker({ userDetailId = newUUID(), mode }: UserDetailFaker): UserDetailInstance | UserDetailPayload {
    const instance = {
        userDetailId,
        userId: newUUID(),
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        pronoun: 'she/her',
        secretQuestion: { question: 'What sound does the fox?', answer: 'Kikikikikiu' },
        birthday: dataGenerator.birthday().toISOString(),
        gameInfo: { campaigns: [], characters: [], badges: [] },
        biography: dataGenerator.biography(),
        role: 'user',
    } as UserDetailInstance;

    const payload = {
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        pronoun: 'she/her',
        secretQuestion: { question: 'What sound does the fox?', answer: 'Kikikikikiu' },
        birthday: dataGenerator.birthday().toISOString(),
        gameInfo: { campaigns: [], characters: [], badges: [] },
        biography: dataGenerator.biography(),
        role: 'user',
    } as UserDetailPayload;

    return mode === 'payload' ? payload : instance;
}

export function generateUserDetailFaker({ count, userDetailId, mode }: UserDetailFaker): UserDetailInstance[] | UserDetailPayload[] {
    const users: UserDetailInstance[] | UserDetailPayload[] = [];

    for (let index = 0; index <= count; index += 1) {
        // @ts-expect-error Expected error
        users.push(createUserDetailFaker({ userDetailId, mode }));
    }

    return users;
}
