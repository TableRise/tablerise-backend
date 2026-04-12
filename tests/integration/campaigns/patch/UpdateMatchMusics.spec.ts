import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a music is added or removed from a match', () => {
    let campaign: Campaign, musicPayload: any;

    before(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        await InjectNewCampaign(campaign);

        musicPayload = {
            operation: 'add',
            title: 'Main Theme',
            youtubeLink: 'https://youtu.be/123',
        };
    });

    it('should sucessfully add a music to a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/musics`)
            .send(musicPayload)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0]).to.have.property('title');
    });

    it('should sucessfully remove a music from a campaign', async () => {
        musicPayload.operation = 'remove';

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/musics`)
            .send(musicPayload)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(0);
    });
});
