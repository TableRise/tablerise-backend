import { UserInstance, UserPayload } from 'src/domains/user/schemas/usersValidationSchema';
import { UserFaker } from '../GeneralDataFaker';
import utils from '../../utils';
import generateNewMongoID from 'src/infra/helpers/generateNewMongoID';

const { dataGenerator } = utils;

function createUserFaker({ userId = generateNewMongoID(), mode }: UserFaker): UserInstance | UserPayload {
    const instance = {
        userId,
        inProgress: { status: 'done', code: '' },
        providerId: generateNewMongoID(),
        email: dataGenerator.email(),
        password: '@Password61',
        nickname: dataGenerator.nickname(),
        tag: `#${dataGenerator.number({ min: 1000, max: 9999 })}`,
        picture: dataGenerator.picture(),
        twoFactorSecret: { active: true },
    } as UserInstance;

    const payload = {
        email: dataGenerator.email(),
        password: '@Password61',
        nickname: dataGenerator.nickname(),
        picture: dataGenerator.picture(),
        twoFactorSecret: { active: true },
    } as UserPayload;

    return mode === 'payload' ? payload : instance; 
}

export function generateUserFaker({ count, userId, mode }: UserFaker): UserInstance[] | UserPayload[] {
    const users: UserInstance[] | UserPayload[] = [];

    for (let index = 0; index <= count; index += 1) {
        // @ts-expect-error Expected error
        users.push(createUserFaker({ userId, mode }));
    }

    return users;
}
