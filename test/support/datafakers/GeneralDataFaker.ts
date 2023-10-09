import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import { generateUserFaker } from './user/UserDataFaker';
import { generateUserDetailFaker } from './user/UserDetailDataFaker';

export type UserFaker = User & { count: number };
export type UserDetailFaker = UserDetail & { count: number };

function generateUserJSON({ count = 1, _id }: UserFaker): User[] {
    return generateUserFaker({ count, _id } as UserFaker);
}

function generateUserDetailJSON({ count = 1, _id }: UserDetailFaker): UserDetail[] {
    return generateUserDetailFaker({ count, _id } as UserDetailFaker);
}

export default {
    generateUserJSON,
    generateUserDetailJSON,
};
