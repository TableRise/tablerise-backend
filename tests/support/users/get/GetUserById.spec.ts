import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover user by id', () => {
    let userOne: UserInstance,
        userTwo: UserInstance,
        userDetailsOne: UserDetailInstance,
        userDetailsTwo: UserDetailInstance;

    context('And data is correct', () => {
        before(async () => {
            userOne = DomainDataFaker.generateUsersJSON()[0];
            userTwo = DomainDataFaker.generateUsersJSON()[0];

            userDetailsOne = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetailsTwo = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetailsOne.userId = userOne.userId;
            userDetailsTwo.userId = userTwo.userId;

            await InjectNewUser(userOne);
            await InjectNewUser(userTwo);
            await InjectNewUserDetails(userDetailsOne, userOne.userId);
            await InjectNewUserDetails(userDetailsTwo, userTwo.userId);
        });

        it('should retrieve user created', async () => {
            const { body } = await requester()
                .get(`/profile/${userOne.userId}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.userId).to.be.not.equal(userTwo.userId);
            expect(body.userId).to.be.equal(userOne.userId);
        });
    });
});
