import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover all users', () => {
    let userOne: UserInstance,
        userTwo: UserInstance,
        userDetailsOne: UserDetailInstance,
        userDetailsTwo: UserDetailInstance;

    context('And all data is correct', () => {
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

        it('should retrieve users created', async () => {
            const { body } = await requester()
                .get(`/users/all`)
                .expect(HttpStatusCode.OK);

            const userOneAdded = body.find(
                (user: RegisterUserResponse) => user.userId === userOne.userId
            );
            const userTwoAdded = body.find(
                (user: RegisterUserResponse) => user.userId === userTwo.userId
            );

            expect(body).to.be.an('array');
            expect(userOneAdded).to.be.not.null();
            expect(userTwoAdded).to.be.not.null();
        });
    });
});
