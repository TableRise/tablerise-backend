import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an user has the email changed', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = { status: 'wait_to_verify', code: 'H45J7F' };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should update email with success', async () => {
            await requester()
                .patch(`/profile/${user.userId}/update/email?code=H45J7F&token=123456`)
                .send({ email: 'test155@email.com' })
                .expect(HttpStatusCode.NO_CONTENT);

            const { body } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(body.email).to.be.not.equal(user.email);
            expect(body.email).to.be.equal('test155@email.com');
        });
    });
});
