import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover user by id', () => {
    let userOne: User, userTwo: User, userDetailsOne: UserDetail, userDetailsTwo: UserDetail;

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
            const { body } = await requester().get(`/users/${userOne.userId}`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.userId).to.be.not.equal(userTwo.userId);
            expect(body.userId).to.be.equal(userOne.userId);
        });

        it('should not retrieve a user waiting to be deleted', async () => {
            const hiddenUser = DomainDataFaker.generateUsersJSON()[0];
            const hiddenUserDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            hiddenUser.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;
            hiddenUserDetails.userId = hiddenUser.userId;

            await InjectNewUser(hiddenUser);
            await InjectNewUserDetails(hiddenUserDetails, hiddenUser.userId);

            await requester().get(`/users/${hiddenUser.userId}`).expect(HttpStatusCode.NOT_FOUND);
        });
    });
});
