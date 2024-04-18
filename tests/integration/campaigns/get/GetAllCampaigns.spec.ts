import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover all campaigns', () => {
    let campaigns: CampaignInstance[];
    context('And is succesfull', () => {
        before(async () => {
            campaigns = [];
            campaigns = DomainDataFaker.generateCampaignsJSON({ count: 1 });
            campaigns.forEach(async (campaign) => {
                campaign.infos.visibility = 'visible';
                await InjectNewCampaign(campaign);
            });
        });

        it('should return correct data', async () => {
            const { body } = await requester()
                .get(`/campaigns`)
                .expect(HttpStatusCode.OK);

            const campaign = body[1];
            expect(body).to.be.an('array');
            expect(campaign).not.to.have.property('campaignId');
            expect(campaign).to.have.property('title');
            expect(campaign.title).to.be.equal(campaigns[0].title);
            expect(campaign).to.have.property('cover');
            expect(campaign.cover).to.be.eql(campaigns[0].cover);
            expect(campaign).to.have.property('description');
            expect(campaign.description).to.be.equal(campaigns[0].description);
            expect(campaign).to.have.property('ageRestriction');
            expect(campaign.ageRestriction).to.be.equal(campaigns[0].ageRestriction);
            expect(campaign).not.to.have.property('system');
            expect(campaign).not.to.have.property('campaignPlayers');
            expect(campaign).to.have.property('playersAmount');
            expect(campaign.playersAmount).to.be.equal(
                campaigns[0].campaignPlayers.length
            );
            expect(campaign).not.to.have.property('matchData');
            expect(campaign).not.to.have.property('infos');
            expect(campaign).not.to.have.property('lores');
            expect(campaign).not.to.have.property('createdAt');
            expect(campaign).to.have.property('updatedAt');
        });
    });
});
