import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an user has the password changed', () => {
    let user: User, userDetails: UserDetail, model: MongoModel<any>;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            model = new DatabaseManagement().modelInstance('user', 'Users');

            user.inProgress = {
                status: InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE,
                currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: 'H45J7F',
            };

            user.twoFactorSecret = { active: true, qrcode: '', secret: '' };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should update password with success', async () => {
            await requester().get(`/users/${user.userId}`).expect(HttpStatusCode.OK);

            await requester()
                .patch('/users/update/password')
                .send({ password: 'TheWorld@123', email: user.email })
                .expect(HttpStatusCode.NO_CONTENT);

            const userInDb = await model.findOne({ email: user.email });
            const isPasswordValid = await SecurePasswordHandler.comparePassword('TheWorld@123', userInDb.password);
            expect(isPasswordValid).to.be.true();
        });
    });
});
