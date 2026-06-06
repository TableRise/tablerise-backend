import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewUser } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When deleting a campaign', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const authenticatedUserDetailsId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

    const buildHighlightedJournal = (player: Campaign['campaignPlayers'][number]) => ({
        postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
        title: 'Campaign highlight',
        author: player,
        content: 'The latest session summary.',
        timestamp: new Date().toISOString(),
        category: 'announcements' as const,
    });

    it('should close a campaign by updating its status', async () => {
        const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: authenticatedUserDetailsId });
        authenticatedUserDetails.gameInfo.campaignsClosedAmount = 1;
        authenticatedUserDetails.gameInfo.badges = [];
        await userDetailsModel.update({ userDetailId: authenticatedUserDetailsId }, authenticatedUserDetails);

        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]);
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/close`)
            .expect(HttpStatusCode.OK);

        expect(body.status).to.equal('closed');

        const { body: authenticatedUserUpdated } = await requester()
            .get(`/users/${authenticatedUserId}`)
            .expect(HttpStatusCode.OK);

        expect(authenticatedUserUpdated.details.gameInfo.campaignsClosedAmount).to.equal(2);
        expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('warrior_badge');

        await requester()
            .get(`/campaigns/${campaign.campaignId as string}`)
            .expect(HttpStatusCode.NOT_FOUND);
    });

    it('should forbid deleting a campaign for non dungeon_master', async () => {
        const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        const dungeonMasterUser = UsersDomainDataFaker.generateUsersJSON()[0];

        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
            {
                userId: dungeonMasterUser.userId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[1]);

        await InjectNewUser(dungeonMasterUser);
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/close`)
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.be.equal('The operation is forbidden for this role');
    });
});
