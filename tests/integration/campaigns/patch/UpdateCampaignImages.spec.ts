import path from 'path';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a map or character image is added or removed from a campaign', () => {
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
            .patch(`/campaigns/${campaign.campaignId}/update/images?operation=add`)
            .attach('image', filePath);
        // .expect(HttpStatusCode.OK);

        expect(body.maps).to.be.an('array');
        expect(body.maps[0]).to.have.property('id');
        expect(body.maps[0]).to.have.property('link');
        expect(body.maps[0]).to.have.property('uploadDate');

        imageId = body.maps[0].id;
    });

    it('should sucessfully remove a map image from a campaign', async () => {
        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId}/update/images?operation=remove&imageId=${imageId}`
            )
            .expect(HttpStatusCode.OK);

        expect(body.maps).to.be.an('array').with.lengthOf(0);
    });

    it('should sucessfully add a character image to a campaign', async () => {
        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId}/update/images?operation=add&name=batman`
            )
            .attach('image', filePath)
            .expect(HttpStatusCode.OK);

        expect(body.characters).to.be.an('array');
        expect(body.characters[0]).to.have.property('id');
        expect(body.characters[0]).to.have.property('title');
        expect(body.characters[0]).to.have.property('link');
        expect(body.characters[0]).to.have.property('uploadDate');

        imageId = body.characters[0].imageId;
    });

    it('should sucessfully remove a character image from a campaign', async () => {
        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId}/update/images?operation=remove&imageId&name=batman`
            )
            .expect(HttpStatusCode.OK);

        expect(body.characters).to.be.an('array').with.lengthOf(0);
    });
});
