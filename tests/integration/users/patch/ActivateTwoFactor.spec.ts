import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user has twoFactor activated', () => {
    let user: User, userDetails: UserDetail;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_ACTIVATE_TWO_FACTOR,
            currentFlow: stateFlowsEnum.enum.ACTIVATE_TWO_FACTOR,
            prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
            nextStatusWillBe: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
            code: '',
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        it('should activate with success', async () => {
            const { body: twoFactorResponse } = await requester()
                .patch(`/users/${user.userId}/2fa/activate`)
                .expect(HttpStatusCode.OK);

            expect(twoFactorResponse).to.have.property('qrcode');
            expect(twoFactorResponse).to.have.property('active');
            expect(twoFactorResponse).to.have.not.property('secret');
            expect(typeof twoFactorResponse.qrcode).to.be.equal('string');
            expect(twoFactorResponse.active).to.be.equal(true);
        });
    });
});
