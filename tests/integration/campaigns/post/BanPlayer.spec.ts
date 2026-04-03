import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainCampaignsDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import DomainUserDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('when the player is banned', () => {
    let campaign: Campaign, user: User, userDetails: UserDetail;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainUserDataFaker.generateUsersJSON()[0];
            userDetails = DomainUserDataFaker.generateUserDetailsJSON()[0];
            campaign = DomainCampaignsDataFaker.generateCampaignsJSON()[0];

            campaign.campaignPlayers[0].userId = user.userId;
            campaign.campaignPlayers[0].role = 'player';

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
            await InjectNewCampaign(campaign);
        });

        it('must ban player successfully', async () => {
            await requester()
                .post(`/campaigns/${campaign.campaignId}/ban?playerId=${user.userId}`)
                .expect(HttpStatusCode.NO_CONTENT);
        });
    });
});
