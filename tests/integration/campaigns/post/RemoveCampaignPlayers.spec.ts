import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';
import sinon from 'sinon';

describe('When a player is removed from a match', () => {
    let campaign: Campaign;

    before(async () => {
        campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);
    });

    after(() => {
        sinon.restore();
    });

    it('should sucessfully remove a player from a campaign', async () => {
        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId}/update/player/remove`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
    });
});
