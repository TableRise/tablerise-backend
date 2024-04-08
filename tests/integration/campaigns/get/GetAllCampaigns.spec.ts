import DatabaseManagement from '@tablerise/database-management';
import sinon from 'sinon';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover all campaigns', () => {
    let campaigns: CampaignInstance[];
    context('And is succesfull', () => {
        before(async () => {

            // campaigns = DomainDataFaker.generateCampaignsJSON({ count: 2});
            // campaigns.forEach(async (campaign) => await InjectNewCampaign(campaign));
            // await InjectNewCampaign(DomainDataFaker.generateCampaignsJSON()[0]);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct data', async () => {

            const { body } = await requester().get(`/campaigns`).expect(HttpStatusCode.OK);
            const x = Object.values(body);
            // console.log('L23',campaigns);
            console.log('L24',x);
            expect(campaigns).to.be.an('array');

        });
    });
});
