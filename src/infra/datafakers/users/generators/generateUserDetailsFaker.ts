import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import newUUID from 'src/infra/helpers/user/newUUID';
import { UserDetailJSONPayload } from 'src/types/users/datafakers/Payload';
import dataGenerator from '../dataGenerator';

function createUserDetailFaker({
    userDetailId = newUUID()
}: UserDetailInstance): UserDetailInstance {
    return {
        userDetailId,
        userId: newUUID(),
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        pronoun: 'she/her',
        secretQuestion: { question: 'What sound does the fox?', answer: 'Kikikikikiu' },
        birthday: dataGenerator.birthday().toISOString(),
        gameInfo: { campaigns: [], characters: [], badges: [] },
        biography: dataGenerator.biography(),
        role: 'admin',
    } as UserDetailInstance;
}

export default function generateUserDetailsFaker({ count, userDetailId }: UserDetailJSONPayload): UserDetailInstance[] {
    const users: UserDetailInstance[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserDetailFaker({ userDetailId } as UserDetailInstance));
    }

    return users;
}