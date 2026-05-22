import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user is updated', function () {
    this.timeout(30000);

    let user: User, userDetails: UserDetail, userToUpdate: any, userDetailsToUpdate: any;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusMustBe: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        beforeEach(() => {
            const user = DomainDataFaker.generateUsersJSON()[0];
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            userToUpdate = {
                nickname: user.nickname,
            };

            userDetailsToUpdate = {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                biography: userDetails.biography,
                birthday: userDetails.birthday,
            };
        });

        it('should update the user with success', async () => {
            const { body: userBeforeUpdate } = await requester().get(`/users/${user.userId}`).expect(HttpStatusCode.OK);

            const { body: userUpdated } = await requester()
                .put(`/users/${user.userId}/update`)
                .send(userToUpdate)
                .expect(HttpStatusCode.OK);

            expect(userUpdated.nickname).to.not.be.equal(userBeforeUpdate.nickname);
            expect(userUpdated.picture).to.not.be.equal(userBeforeUpdate.picture);
            expect(userUpdated).to.not.have.property('details');
        });

        it('should update the user details with success', async () => {
            const { body: userBeforeUpdate } = await requester().get(`/users/${user.userId}`).expect(HttpStatusCode.OK);

            const { body: userDetailsUpdated } = await requester()
                .put(`/users/${user.userId}/update/details`)
                .send(userDetailsToUpdate)
                .expect(HttpStatusCode.OK);

            expect(userDetailsUpdated.firstName).to.not.be.equal(userBeforeUpdate.details.firstName);
            expect(userDetailsUpdated.lastName).to.not.be.equal(userBeforeUpdate.details.lastName);
            expect(userDetailsUpdated.biography).to.not.be.equal(userBeforeUpdate.details.biography);
            expect(userDetailsUpdated.birthday).to.not.be.equal(userBeforeUpdate.details.birthday);
        });
    });
});
