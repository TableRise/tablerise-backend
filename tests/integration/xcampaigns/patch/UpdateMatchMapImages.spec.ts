import path from 'path';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a map image is added or removed from a match', () => {
    let campaign: CampaignInstance, imageId: string, filePath: any;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        filePath = path.resolve(
            __dirname,
            '../../../support/assets/test-image-batman.jpeg'
        );
    });

    it('should sucessfully add a map image to a campaign', async () => {
        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId}/update/match/map-images?operation=add`
            )
            .attach('mapImage', filePath)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0]).to.have.property('id');
        expect(body[0]).to.have.property('link');
        expect(body[0]).to.have.property('uploadDate');

        imageId = body[0].id;
    });

    it('should sucessfully remove a map image from a campaign', async () => {
        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId}/update/match/map-images?operation=remove&imageId=${imageId}`
            )
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(0);
    });
});
