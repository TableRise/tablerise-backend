import path from 'path';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a map or character image is added or removed from a campaign', () => {
    let campaign: Campaign, filePath: any;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        filePath = path.resolve(__dirname, '../../../support/assets/test-image-batman.jpeg');
    });

    it('should sucessfully add a map image to a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/images`)
            .attach('picture', filePath)
            .field('operation', 'add')
            .expect(HttpStatusCode.OK);

        expect(body.maps).to.be.an('array');
        expect(body.maps[0]).to.have.property('id');
        expect(body.maps[0]).to.have.property('link');
        expect(body.maps[0]).to.have.property('uploadDate');
    });

    it('should sucessfully remove a map image from a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/images`)
            .field('operation', 'remove')
            .field('imageId', '');

        expect(body.maps).to.be.an('array').with.lengthOf(0);
    });
});
