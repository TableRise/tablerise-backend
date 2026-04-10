import path from 'path';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a map image is added or removed from a match', () => {
    let campaign: Campaign, filePath: any;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        filePath = path.resolve(__dirname, '../../../support/assets/test-image-batman.jpeg');
    });

    it('should sucessfully add a map image to a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/map-images`)
            .attach('picture', filePath)
            .field('operation', 'add')
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0]).to.have.property('id');
        expect(body[0]).to.have.property('link');
        expect(body[0]).to.have.property('uploadDate');
    });

    it('should sucessfully remove a map image from a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/map-images`)
            .field('operation', 'remove')
            .field('imageId', '')
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(0);
    });
});
