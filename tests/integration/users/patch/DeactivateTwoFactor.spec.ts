import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user has twoFactor deactivated', () => {
    let user: User, userDetails: UserDetail, model: MongoModel<any>;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        model = new DatabaseManagement().modelInstance('user', 'Users');

        user.inProgress = {
            status: InProgressStatusEnum.enum.WAIT_TO_DISABLE_TWO_FACTOR,
            currentFlow: stateFlowsEnum.enum.DISABLE_TWO_FACTOR,
            prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        user.twoFactorSecret = {
            active: true,
            qrcode: 'qr-code',
            secret: 'secret-code',
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        it('should deactivate with success', async () => {
            await requester().patch(`/users/${user.userId}/2fa/deactivate`).expect(HttpStatusCode.NO_CONTENT);

            const userInDb = await model.findOne({ userId: user.userId });

            expect(userInDb.inProgress.status).to.be.equal(InProgressStatusEnum.enum.DONE);
            expect(userInDb.twoFactorSecret.active).to.be.equal(false);
            expect(userInDb.twoFactorSecret.qrcode).to.be.equal('');
            expect(userInDb.twoFactorSecret.secret).to.be.equal('keep');
        });
    });
});
