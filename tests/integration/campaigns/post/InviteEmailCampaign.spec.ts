import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('when the email invitation is sent', () => {
    let campaign: Campaign, user: User, userDetails: UserDetail;

    context('And data is correct', () => {
        before(async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            user = UsersDomainDataFaker.generateUsersJSON()[0];
            userDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
            await InjectNewCampaign(campaign);
        });

        it('must send email successfully', async () => {
            await requester()
                .post(`/campaigns/${campaign.campaignId as string}/invite?targetEmail=${user.email}`)
                .expect(HttpStatusCode.NO_CONTENT);
        });
    });
});
