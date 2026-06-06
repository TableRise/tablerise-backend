import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a campaign buy is created', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const authenticatedUserDetailsId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');
    let campaign: Campaign;

    const buildHighlightedJournal = (player: Campaign['campaignPlayers'][number]) => ({
        postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
        title: 'Campaign highlight',
        author: player,
        content: 'The latest session summary.',
        timestamp: new Date().toISOString(),
        category: 'announcements' as const,
    });

    beforeEach(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.buys = [];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]);

        const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: authenticatedUserDetailsId });
        authenticatedUserDetails.gameInfo.equipBoughtAmount = 9;
        authenticatedUserDetails.gameInfo.badges = [];
        await userDetailsModel.update({ userDetailId: authenticatedUserDetailsId }, authenticatedUserDetails);

        await InjectNewCampaign(campaign);
    });

    it('should append one new buy to the campaign buys array and award the first buy badge', async () => {
        const payload = {
            name: 'Potion',
            cost: '10 gp',
            character: 'Lia',
            user: 'buyer-user',
            date: '2026-05-16',
        };

        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/buys`)
            .send(payload)
            .expect(HttpStatusCode.CREATED);

        expect(body.buys).to.have.lengthOf(1);
        expect(body.buys[0]).to.include(payload);

        const { body: authenticatedUserUpdated } = await requester()
            .get(`/users/${authenticatedUserId}`)
            .expect(HttpStatusCode.OK);
        expect(authenticatedUserUpdated.details.gameInfo.equipBoughtAmount).to.equal(10);
        expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('imp_badge');
    });

    it('should preserve existing buys and append the new one at the end', async () => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.buys = [
            {
                name: 'Torch',
                cost: '1 sp',
                character: 'Rin',
                user: 'existing-user',
                date: '2026-05-15',
            },
        ];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]);

        await InjectNewCampaign(campaign);

        const payload = {
            name: 'Potion',
            cost: '10 gp',
            character: 'Lia',
            user: 'buyer-user',
            date: '2026-05-16',
        };

        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/buys`)
            .send(payload)
            .expect(HttpStatusCode.CREATED);

        expect(body.buys).to.have.lengthOf(2);
        expect(body.buys[0]).to.include({
            name: 'Torch',
            cost: '1 sp',
            character: 'Rin',
            user: 'existing-user',
            date: '2026-05-15',
        });
        expect(body.buys[1]).to.include(payload);
    });

    it('should return campaign-player-not-exists when caller is outside the campaign', async () => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: '00000000-0000-0000-0000-000000000001',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.buys = [];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]);

        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/buys`)
            .send({
                name: 'Forbidden item',
                cost: '99 gp',
                character: 'Lia',
                user: 'buyer-user',
                date: '2026-05-16',
            })
            .expect(HttpStatusCode.NOT_FOUND);

        expect(body.message).to.equal('This player is not in the campaign');
    });
});
