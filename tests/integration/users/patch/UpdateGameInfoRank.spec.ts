import DatabaseManagement from '@tablerise/database-management';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a badge is added and user rank must be updated', () => {
    let user: User, userDetails: UserDetail;
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusWas: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        userDetails.gameInfo.badges = Array.from({ length: 9 }, (_, index) => `badge-${index}`);
        userDetails.gameInfo.campaigns = [];
        userDetails.gameInfo.characters = [];
        userDetails.rank = 'bronze';

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    it('should set rank to diamond when badges reach 10', async () => {
        const payload = {
            infoId: newUUID(),
            targetInfo: 'badges',
            data: {},
        };

        await requester().patch(`/users/${user.userId}/update/game-info/add`).send(payload).expect(HttpStatusCode.OK);

        const persistedUserDetails = await userDetailsModel.findOne({ userDetailId: userDetails.userDetailId });

        expect(persistedUserDetails.gameInfo.badges).to.have.lengthOf(10);
        expect(persistedUserDetails.rank).to.be.equal('diamond');
    });
});
