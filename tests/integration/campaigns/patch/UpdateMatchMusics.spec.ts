import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a music is added or removed from a match', () => {
    let campaign: Campaign, musicPayload: any;

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

        musicPayload = {
            title: 'Main Theme',
            id: 'https://youtu.be/123',
            thumbnail: 'https://i.ytimg.com/vi/123/default.jpg',
        };
    });

    it('should sucessfully add a music to a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/musics/add`)
            .send(musicPayload)
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0]).to.have.property('title');
    });

    it('should sucessfully remove a music from a campaign', async () => {
        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/musics/remove`)
            .send({ id: musicPayload.id })
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(0);
    });

    it('should sucessfully edit a music from a campaign', async () => {
        await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/musics/add`)
            .send(musicPayload)
            .expect(HttpStatusCode.OK);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/match/musics/edit`)
            .send({
                id: musicPayload.id,
                title: 'Introducao a Campanha | Theme',
                thumbnail: 'https://i.ytimg.com/vi/L9dhkINF5Vk/default.jpg',
            })
            .expect(HttpStatusCode.OK);

        expect(body).to.be.an('array').with.lengthOf(1);
        expect(body[0].title).to.be.equal('Introducao a Campanha | Theme');
    });
});
