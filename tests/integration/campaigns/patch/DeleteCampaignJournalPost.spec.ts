import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When deleting a campaign journal post', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    let campaign: Campaign;

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                notes: [],
                role: 'player',
                status: 'active',
            },
            {
                userId: 'f4edb741-65cb-432f-bf04-796fc1dcbadf',
                characterIds: [],
                notes: [],
                role: 'admin_player',
                status: 'active',
            },
            {
                userId: 'c3d2d6d0-0bb8-4b57-81a0-d5ece96d719d',
                characterIds: [],
                notes: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.infos.journal = [
            {
                postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
                title: 'Delete me',
                content: 'Content to delete',
                author: campaign.campaignPlayers[0],
                timestamp: new Date().toISOString(),
                category: 'players',
            } as any,
        ];
        campaign.infos.highlightedJournal = campaign.infos.journal[0] as any;
    });

    it('should allow the author to delete the post', async () => {
        await InjectNewCampaign(campaign);

        await requester()
            .delete(
                `/campaigns/${
                    campaign.campaignId as string
                }/delete/journal?userId=${authenticatedUserId}&postId=12cd093b-0a8a-42fe-910f-001f2ab28450`
            )
            .expect(HttpStatusCode.NO_CONTENT);

        const { body } = await requester()
            .get(`/campaigns/${campaign.campaignId as string}/journal/posts`)
            .expect(HttpStatusCode.OK);

        expect(body).to.have.lengthOf(0);
    });

    it('should allow admins to delete another author post', async () => {
        campaign.campaignPlayers[0].userId = '6d1155b7-7c30-4b0f-890e-1f665fb692d2';
        campaign.campaignPlayers[1].userId = authenticatedUserId;
        (campaign.infos.journal[0] as any).author = campaign.campaignPlayers[0];
        await InjectNewCampaign(campaign);

        await requester()
            .delete(
                `/campaigns/${
                    campaign.campaignId as string
                }/delete/journal?userId=6d1155b7-7c30-4b0f-890e-1f665fb692d2&postId=12cd093b-0a8a-42fe-910f-001f2ab28450`
            )
            .expect(HttpStatusCode.NO_CONTENT);
    });

    it('should reject unrelated players deleting another author post', async () => {
        campaign.campaignPlayers[0].userId = 'c3d2d6d0-0bb8-4b57-81a0-d5ece96d719d';
        campaign.campaignPlayers[2].userId = authenticatedUserId;
        (campaign.infos.journal[0] as any).author = campaign.campaignPlayers[0];
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .delete(
                `/campaigns/${
                    campaign.campaignId as string
                }/delete/journal?userId=c3d2d6d0-0bb8-4b57-81a0-d5ece96d719d&postId=12cd093b-0a8a-42fe-910f-001f2ab28450`
            )
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.be.equal('The operation is forbidden for this role');
    });

    it('should clear the highlighted journal when deleting the highlighted post', async () => {
        await InjectNewCampaign(campaign);

        await requester()
            .delete(
                `/campaigns/${
                    campaign.campaignId as string
                }/delete/journal?userId=${authenticatedUserId}&postId=12cd093b-0a8a-42fe-910f-001f2ab28450`
            )
            .expect(HttpStatusCode.NO_CONTENT);

        const { body } = await requester()
            .get(`/campaigns/${campaign.campaignId as string}/journal/highlight`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.deep.equal({});
    });
});
