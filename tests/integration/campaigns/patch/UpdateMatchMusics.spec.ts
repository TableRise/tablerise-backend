import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a music is added or removed from a match', () => {
    let campaign: CampaignInstance, musicPayload: any;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        musicPayload = {
            title: 'Main Theme',
            youtubeLink: 'https://youtu.be/123',
        };
    });

    it('should sucessfully add a music to a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId}/update/match/musics?operation=add`)
            .send(musicPayload)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0]).to.have.property('title');
        expect(body[0]).to.have.property('youtubeLink');
    });

    it('should sucessfully remove a music from a campaign', async () => {
        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId}/update/match/map-images?operation=remove`
            )
            .send(musicPayload)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(0);
    });
});
