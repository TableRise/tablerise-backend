import path from 'path';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When gallery images are added or highlighted in a match', () => {
    let campaign: Campaign, filePath: string;

    beforeEach(async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = [];
        campaign.matchData.imageHighlighted = null as any;
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

    it('should sucessfully add a gallery image to a campaign match', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/images`)
            .attach('images', filePath)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0]).to.have.property('id');
        expect(body[0]).to.have.property('link');
        expect(body[0]).to.have.property('uploadDate');
    });

    it('should sucessfully highlight a gallery image in a campaign match', async () => {
        const { body: images } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/images`)
            .attach('images', filePath)
            .expect(HttpStatusCode.OK);

        const { body } = await requester()
            .patch(
                `/campaigns/${campaign.campaignId as string}/update/match/images/highlight?imageId=${
                    images[0].id as string
                }`
            )
            .expect(HttpStatusCode.OK);

        expect(body.id).to.equal(images[0].id);
        expect(body.link).to.equal(images[0].link);
    });

    it('should sucessfully remove the highlighted gallery image from a campaign match', async () => {
        const { body: images } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/images`)
            .attach('images', filePath)
            .expect(HttpStatusCode.OK);

        await requester()
            .patch(
                `/campaigns/${campaign.campaignId as string}/update/match/images/highlight?imageId=${
                    images[0].id as string
                }`
            )
            .expect(HttpStatusCode.OK);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/images/highlight?remove=true`)
            .expect(HttpStatusCode.OK);

        expect(body).to.equal(null);
    });

    it('should fail when trying to highlight a missing image', async () => {
        await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/images/highlight?imageId=missing-image`)
            .expect(HttpStatusCode.NOT_FOUND);
    });
});
