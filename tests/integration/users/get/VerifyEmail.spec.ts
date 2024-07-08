import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an email is verified', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = { status: 'done', code: '' };
            user.email = 'test@email.com';

            userDetails.gameInfo.badges = [];
            userDetails.gameInfo.campaigns = [];
            userDetails.gameInfo.characters = [];

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should verify and change status - email', async () => {
            await requester()
                .get(`/users/verify?email=test@email.com`)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(body.inProgress.status).to.be.equal('wait_to_verify');
        });

        it('should verify and change status - newEmail', async () => {
            await requester()
                .get(`/users/verify?newEmail=test2@email.com&email=test@email.com`)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(body.inProgress.status).to.be.equal('wait_to_verify');
        });
    });
});
