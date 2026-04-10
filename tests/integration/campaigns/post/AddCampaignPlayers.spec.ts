import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';
import sinon from 'sinon';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';

describe('When a player is added to a match', () => {
    let campaign: Campaign;

    before(async () => {
        campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        campaign.password = await SecurePasswordHandler.hashPassword('1234');

        await InjectNewCampaign(campaign);
    });

    after(() => {
        sinon.restore();
    });

    it('should sucessfully add a player to a campaign', async () => {
        const { body } = await requester()
            .post(`/campaigns/${campaign.campaignId as string}/update/player/add?password=1234`)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(2);
        expect(body[1]).to.have.property('userId');
        expect(body[1]).to.have.property('characterIds');
        expect(body[1]).to.have.property('role');
        expect(body[1]).to.have.property('status');
    });
});
