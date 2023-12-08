import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserJSONPayload } from 'src/types/users/datafakers/Payload';
import dataGenerator from '../dataGenerator';

function createUserFaker({ userId = newUUID() }: UserInstance): UserInstance {
    return {
        userId,
        inProgress: { status: 'wait_to_confirm', code: 'HJS74' },
        providerId: '',
        email: dataGenerator.email(),
        password: 'TheWorld@122',
        nickname: dataGenerator.nickname(),
        tag: `#${dataGenerator.number({ min: 1000, max: 9999 })}`,
        picture: {
            id: '123',
            link: 'https://imgur.com',
            uploadDate: new Date(),
        },
        twoFactorSecret: { active: false },
    } as UserInstance;
}

export default function generateUsersFaker({
    count,
    userId,
}: UserJSONPayload): UserInstance[] {
    const users: UserInstance[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserFaker({ userId } as UserInstance));
    }

    return users;
}
