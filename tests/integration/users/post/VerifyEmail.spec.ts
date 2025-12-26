import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an email is verified', () => {
    let user: User, userDetails: UserDetail;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                code: '',
            };

            user.email = 'test@email.com';

            userDetails.gameInfo.badges = [];
            userDetails.gameInfo.campaigns = [];
            userDetails.gameInfo.characters = [];

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should verify and change status - email', async () => {
            await requester()
                .post(`/users/authenticate/email/send-code?email=test@email.com&flow=update-password`)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body } = await requester().get(`/users/${user.userId as string}`).expect(HttpStatusCode.OK);

            expect(body.inProgress.status).to.be.equal(InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE);
        });
    });
});
