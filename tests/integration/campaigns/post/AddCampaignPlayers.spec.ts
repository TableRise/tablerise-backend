import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';
import sinon from 'sinon';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import DatabaseManagement from '@tablerise/database-management';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('When a player is added to a match', function () {
    this.timeout(30000);

    let campaign: Campaign;
    const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const userLoggedDetailsId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

    const buildHighlightedJournal = (player: Campaign['campaignPlayers'][number]) => ({
        postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
        title: 'Campaign highlight',
        author: player,
        content: 'The latest session summary.',
        timestamp: new Date().toISOString(),
        category: 'announcements' as const,
    });

    before(async () => {
        campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        campaign.password = await SecurePasswordHandler.hashPassword('1234');
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]);

        await InjectNewCampaign(campaign);

        const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: userLoggedDetailsId });
        authenticatedUserDetails.gameInfo.campaigns = Array.from({ length: 49 }, (_, index) => ({
            campaignId: newUUID(),
            notes: [],
        }));
        authenticatedUserDetails.gameInfo.badges = [];

        await userDetailsModel.update({ userDetailId: userLoggedDetailsId }, authenticatedUserDetails);
    });

    after(() => {
        sinon.restore();
    });

    it('should sucessfully add a player to a campaign', async () => {
        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/update/player/add?password=1234`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(2);
        expect(body[1]).to.have.property('userId');
        expect(body[1]).to.have.property('characterIds');
        expect(body[1]).to.have.property('role');
        expect(body[1]).to.have.property('status');

        const { body: authenticatedUserUpdated } = await requester()
            .get(`/users/${userLoggedId}`)
            .expect(HttpStatusCode.OK);
        expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('badge_10_campaigns');
        expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('badge_50_campaigns');
    });

    it('should return an error when campaign already reached player limit', async () => {
        const fullCampaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        fullCampaign.password = await SecurePasswordHandler.hashPassword('1234');
        fullCampaign.infos.playerAmountLimit = 1;
        fullCampaign.campaignPlayers = [
            {
                userId: fullCampaign.campaignPlayers[0].userId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        fullCampaign.infos.highlightedJournal = buildHighlightedJournal(fullCampaign.campaignPlayers[0]);

        await InjectNewCampaign(fullCampaign);

        const { body } = await requester()
            .post(`/campaigns/${fullCampaign.campaignId as string}/update/player/add?password=1234`)
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.be.equal('The campaign reached the limit of players');
    });
});
