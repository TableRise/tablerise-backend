import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SecurePasswordHandler from 'src/domains/user/helpers/SecurePasswordHandler';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';

describe('When the user is updated', () => {
    let user: UserInstance, userDetails: UserDetailInstance, userToUpdate: any;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = { status: 'done', code: '' };
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();

        userDetails.userId = user.userId;

        const modelUser = new DatabaseManagement().modelInstance('user', 'Users');
        const modelUserDetails = new DatabaseManagement().modelInstance(
            'user',
            'UserDetails'
        );

        await modelUser.create(user);
        await modelUserDetails.create(userDetails);
    });

    context('And all data is correct', () => {
        beforeEach(() => {
            const user = DomainDataFaker.generateUsersJSON()[0];
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            userToUpdate = {
                nickname: user.nickname,
                picture: user.picture,
                details: {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    pronoun: userDetails.pronoun,
                    biography: userDetails.biography,
                    birthday: userDetails.birthday,
                },
            };
        });

        it('should update with success', async () => {
            const { body: userBeforeUpdate } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            const { body: userUpdated } = await requester()
                .put(`/profile/${user.userId}/update`)
                .send(userToUpdate);

            expect(userUpdated.nickname).to.not.be.equal(userBeforeUpdate.nickname);
            expect(userUpdated.picture).to.not.be.equal(userBeforeUpdate.picture);
            expect(userUpdated.details.firstName).to.not.be.equal(
                userBeforeUpdate.details.firstName
            );
            expect(userUpdated.details.lastName).to.not.be.equal(
                userBeforeUpdate.details.lastName
            );
            expect(userUpdated.details.pronoun).to.not.be.equal(
                userBeforeUpdate.details.pronoun
            );
            expect(userUpdated.details.biography).to.not.be.equal(
                userBeforeUpdate.details.biography
            );
            expect(userUpdated.details.birthday).to.not.be.equal(
                userBeforeUpdate.details.birthday
            );
        });
    });
});
