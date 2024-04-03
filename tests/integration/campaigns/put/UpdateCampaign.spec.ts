import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a campaign is updated', () => {
    let campaign: CampaignInstance, newCampaignPayload: any;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        newCampaignPayload = {
            title: 'Main Theme',
            description: 'New desc',
            visibility: 'hidden',
        };
    });

    it.only('should sucessfully update a campaign', async () => {
        const { body } = await requester()
            .put(`/campaigns/${campaign.campaignId}/update`)
            .send(newCampaignPayload)
            .expect(HttpStatusCode.OK);

        expect(body).to.have.property('title');
        expect(body.title).to.be.equal(newCampaignPayload.title);
        expect(body.description).to.be.equal(newCampaignPayload.description);
        expect(body.infos.visibility).to.be.equal(newCampaignPayload.visibility);
    });
});
