import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recovering the highlighted journal post of a campaign', () => {
    let campaign: Campaign;

    beforeEach(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
    });

    it('should return the stored highlighted journal post', async () => {
        campaign.infos.highlightedJournal = {
            title: 'Pinned note',
            author: campaign.campaignPlayers[0],
            content: 'The bridge is destroyed.',
            timestamp: new Date().toISOString(),
            category: 'master',
        };

        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .get(`/campaigns/${campaign.campaignId as string}/journal/highlight`)
            .expect(HttpStatusCode.OK);

        expect(body).to.have.property('title', 'Pinned note');
        expect(body).to.have.property('content', 'The bridge is destroyed.');
    });

    it('should return an empty object when the highlight is cleared', async () => {
        campaign.infos.highlightedJournal = {} as Campaign['infos']['highlightedJournal'];

        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .get(`/campaigns/${campaign.campaignId as string}/journal/highlight`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.deep.equal({});
    });
});
