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
        campaign.infos.highlightedJournal = {
            title: 'Pinned note',
            author: {
                userId: campaign.campaignPlayers[0].userId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
            content: 'Current highlight',
            timestamp: new Date().toISOString(),
            category: 'master',
        } as Campaign['infos']['highlightedJournal'];
        await InjectNewCampaign(campaign);

        filePath = path.resolve(__dirname, '../../../support/assets/test-image-batman.jpeg');
    });

    it('should sucessfully add a map image to a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/map-images/add`)
            .attach('mapImages', filePath)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0]).to.have.property('id');
        expect(body[0]).to.have.property('link');
        expect(body[0]).to.have.property('uploadDate');
    });

    it('should sucessfully remove a map image from a campaign', async () => {
        const { body: addBody } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/map-images/add`)
            .attach('mapImages', filePath)
            .expect(HttpStatusCode.OK);

        await requester()
            .patch(
                `/campaigns/${
                    campaign.campaignId as string
                }/update/match/map-images/remove?imageUrl=${encodeURIComponent(addBody[0].link)}`
            )
            .expect(HttpStatusCode.NO_CONTENT);
    });
});
