import { UserDetailInstance, UserDetailPayload } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance, UserPayload } from 'src/domains/user/schemas/usersValidationSchema';
import { generateUserFaker } from './user/UserDataFaker';
import { generateUserDetailFaker } from './user/UserDetailDataFaker';

export interface UserFaker {
    count: number;
    userId?: string;
    mode: 'payload' | 'instance';
}
export interface UserDetailFaker {
    count: number;
    userDetailId?: string;
    mode: 'payload' | 'instance';
}

function generateUserJSON({ count = 1, userId, mode }: UserFaker = { count: 1, mode: 'payload' }): UserInstance[] | UserPayload[] {
    return generateUserFaker({ count, userId, mode } as UserFaker);
}

function generateUserDetailJSON({ count = 1, userDetailId, mode }: UserDetailFaker = { count: 1, mode: 'payload' }): UserDetailInstance[] | UserDetailPayload[] {
    return generateUserDetailFaker({ count, userDetailId, mode } as UserDetailFaker);
}

export default {
    generateUserJSON,
    generateUserDetailJSON,
};
