import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an user has the password changed', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = { status: 'wait_to_verify', code: 'H45J7F' };
            userDetails.secretQuestion = null;

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should update password with success', async () => {
            const { body: userWithOldPassword } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            await requester()
                .patch(`/profile/update/password?email=${user.email}&code=H45J7F`)
                .send({ password: 'TheWorld@123' })
                .expect(HttpStatusCode.NO_CONTENT);

            const { body: userWithNewPassword } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(userWithNewPassword.password).to.be.not.equal(userWithOldPassword.password);
        });
    });

    context('And all data is correct - secret question', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = { status: 'wait_to_verify', code: 'H45J7F' };
            user.twoFactorSecret = { active: false };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should update password with success', async () => {
            const { body: userWithOldPassword } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            await requester()
                .patch(
                    `/profile/update/password?email=${user.email}&code=H45J7F&question=${
                        userDetails.secretQuestion?.question as string
                    }&answer=${userDetails.secretQuestion?.answer as string}`
                )
                .send({ password: 'TheWorld@123' })
                .expect(HttpStatusCode.NO_CONTENT);

            const { body: userWithNewPassword } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(userWithNewPassword.password).to.be.not.equal(userWithOldPassword.password);
        });
    });
});
