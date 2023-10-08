import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';

export type UserFaker = User & { count: number };
export type UserDetailFaker = UserDetail & { count: number };

function generateUserFaker({ count = 1, _id }: UserFaker): User[] {
    return generateUserFaker({ count, _id } as UserFaker);
}

function generateUserDetailsFaker({ count = 1, _id }: UserDetailFaker): UserDetail {
    return generateUserDetailsFaker({ count, _id } as UserDetailFaker);
}

export default {
    generateUserFaker,
    generateUserDetailsFaker,
};
