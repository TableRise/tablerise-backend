import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When updating a campaign journal post', () => {
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
                userId: 'bcf390df-6bc7-47be-bd72-e6de9a7e21e1',
                characterIds: [],
                notes: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        campaign.infos.journal = [
            {
                postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
                title: 'Old title',
                content: 'Old content',
                author: campaign.campaignPlayers[0],
                timestamp: new Date().toISOString(),
                category: 'players',
            } as any,
        ];
        campaign.infos.highlightedJournal = campaign.infos.journal[0] as any;
    });

    it('should allow the author to update the post', async () => {
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/journal?userId=${authenticatedUserId}`)
            .send({
                postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
                title: 'Updated title',
                post: 'Updated content',
                category: 'players',
            })
            .expect(HttpStatusCode.OK);

        expect(body).to.include({
            postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
            title: 'Updated title',
            content: 'Updated content',
            category: 'players',
        });
    });

    it('should reject non-authors even if they are dungeon masters', async () => {
        campaign.campaignPlayers[0].userId = 'c3d2d6d0-0bb8-4b57-81a0-d5ece96d719d';
        campaign.campaignPlayers[1].userId = authenticatedUserId;
        (campaign.infos.journal[0] as any).author = campaign.campaignPlayers[0];
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId as string}/update/journal?userId=c3d2d6d0-0bb8-4b57-81a0-d5ece96d719d`
            )
            .send({
                postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
                title: 'Updated title',
                post: 'Updated content',
                category: 'players',
            })
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.be.equal('The operation is forbidden for this role');
    });

    it('should update the highlighted journal when the edited post is highlighted', async () => {
        await InjectNewCampaign(campaign);

        await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/journal?userId=${authenticatedUserId}`)
            .send({
                postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
                title: 'Updated title',
                post: 'Updated content',
                category: 'players',
            })
            .expect(HttpStatusCode.OK);

        const { body } = await requester()
            .get(`/campaigns/${campaign.campaignId as string}/journal/highlight`)
            .expect(HttpStatusCode.OK);

        expect(body).to.include({
            postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
            title: 'Updated title',
            content: 'Updated content',
        });
    });
});
