import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import { generateUserFaker } from './user/UserDataFaker';
import { generateUserDetailFaker } from './user/UserDetailDataFaker';

export interface UserFaker {
    count: number;
    _id?: string;
}
export interface UserDetailFaker {
    count: number;
    _id?: string;
}

function generateUserJSON({ count = 1, _id }: UserFaker = { count: 1 }): User[] {
    return generateUserFaker({ count, _id } as UserFaker);
}

function generateUserDetailJSON({ count = 1, _id }: UserDetailFaker = { count: 1 }): UserDetail[] {
    return generateUserDetailFaker({ count, _id } as UserDetailFaker);
}

export default {
    generateUserJSON,
    generateUserDetailJSON,
};
