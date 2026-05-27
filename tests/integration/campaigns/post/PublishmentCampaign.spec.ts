import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a journal post is published', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    let campaign: Campaign;

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
        campaign.infos.journal = [];
        campaign.infos.highlightedJournal = {
            title: 'Pinned note',
            author: campaign.campaignPlayers[0],
            content: 'The town is waiting.',
            timestamp: new Date().toISOString(),
            category: 'players',
        } as any;

        await InjectNewCampaign(campaign);
    });

    it('should add the new post to the campaign journal', async () => {
        const payload = {
            title: 'New character will be added',
            content: 'In next match we will have a new char',
            category: 'players',
        };

        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/journal/post`)
            .send(payload)
            .expect(HttpStatusCode.CREATED);

        expect(body.infos.journal).to.have.lengthOf(1);
        expect(body.infos.journal[0]).to.include({
            title: payload.title,
            content: payload.content,
            category: payload.category,
        });
        expect(body.infos.journal[0].author.userId).to.be.equal(authenticatedUserId);
        expect(body.infos.journal[0].postId).to.be.a('string');
    });
});
