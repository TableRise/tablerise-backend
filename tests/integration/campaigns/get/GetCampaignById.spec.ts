import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover user by id', () => {
    let campaignOne: CampaignInstance, campaignTwo: CampaignInstance;

    context('And data is correct', () => {
        before(async () => {
            campaignOne = DomainDataFaker.generateCampaignsJSON()[0];
            campaignTwo = DomainDataFaker.generateCampaignsJSON()[0];

            await InjectNewCampaign(campaignOne);
            await InjectNewCampaign(campaignTwo);
        });

        it('should retrieve campaign created', async () => {
            const { body } = await requester()
                .get(`/campaigns/${campaignOne.campaignId}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.campaignId).to.be.not.equal(campaignTwo.campaignId);
            expect(body.campaignId).to.be.equal(campaignOne.campaignId);
        });
    });
});
