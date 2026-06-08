import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover user by nickname and tag', () => {
    let userOne: User, userTwo: User, userDetailsOne: UserDetail, userDetailsTwo: UserDetail;

    context('And data is correct', () => {
        before(async () => {
            userOne = DomainDataFaker.generateUsersJSON()[0];
            userTwo = DomainDataFaker.generateUsersJSON()[0];
            userTwo.nickname = userOne.nickname;
            userTwo.tag = '#1234';

            userDetailsOne = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetailsTwo = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetailsOne.userId = userOne.userId;
            userDetailsTwo.userId = userTwo.userId;

            await InjectNewUser(userOne);
            await InjectNewUser(userTwo);
            await InjectNewUserDetails(userDetailsOne, userOne.userId);
            await InjectNewUserDetails(userDetailsTwo, userTwo.userId);
        });

        it('should retrieve the exact matched user handle', async () => {
            const { body } = await requester()
                .get(`/users?nickname=${encodeURIComponent(`${userOne.nickname}${userOne.tag}`)}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.userId).to.be.equal(userOne.userId);
            expect(body.userId).to.be.not.equal(userTwo.userId);
            expect(body.nickname).to.be.equal(userOne.nickname);
            expect(body.tag).to.be.equal(userOne.tag);
        });

        it('should return not found for an unknown handle', async () => {
            await requester().get('/users?nickname=unknown_user%239999').expect(HttpStatusCode.NOT_FOUND);
        });

        it('should not retrieve a user waiting to be deleted', async () => {
            const hiddenUser = DomainDataFaker.generateUsersJSON()[0];
            const hiddenUserDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            hiddenUser.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_DELETE_USER;
            hiddenUserDetails.userId = hiddenUser.userId;

            await InjectNewUser(hiddenUser);
            await InjectNewUserDetails(hiddenUserDetails, hiddenUser.userId);

            await requester()
                .get(`/users?nickname=${encodeURIComponent(`${hiddenUser.nickname}${hiddenUser.tag}`)}`)
                .expect(HttpStatusCode.NOT_FOUND);
        });
    });
});
