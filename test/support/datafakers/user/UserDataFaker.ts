import { User } from 'src/schemas/user/usersValidationSchema';
import { UserFaker } from '../GeneralDataFaker';
import utils from '../../utils';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

const { dataGenerator } = utils;

function createUserFaker({ _id = generateNewMongoID() }: User): User {
    return {
        _id,
        inProgress: { status: 'done', code: '' },
        providerId: generateNewMongoID(),
        email: dataGenerator.email(),
        password: '@Password61',
        nickname: dataGenerator.nickname(),
        tag: `#${dataGenerator.number({ min: 1000, max: 9999 })}`,
        picture: dataGenerator.picture(),
        twoFactorSecret: { active: true },
    };
}

export function generateUserFaker({ count, _id }: UserFaker): User[] {
    const users: User[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserFaker({ _id } as User));
    }

    return users;
}
