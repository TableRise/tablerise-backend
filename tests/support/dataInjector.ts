import DatabaseManagement from '@tablerise/database-management';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';

export async function InjectNewUser(user: UserInstance): Promise<void> {
    user.password =
        user.password !== 'oauth'
            ? await SecurePasswordHandler.hashPassword(user.password)
            : user.password;

    user.createdAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    const model = new DatabaseManagement().modelInstance('user', 'Users');
    await model.create(user);
}

export async function InjectNewUserDetails(
    userDetails: UserDetailInstance,
    userId: string
): Promise<void> {
    userDetails.userId = userId;

    const modelUserDetails = new DatabaseManagement().modelInstance('user', 'UserDetails');
    await modelUserDetails.create(userDetails);
}
