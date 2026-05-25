import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When updating or removing a campaign player note', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    let campaign: Campaign;

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                notes: [{ title: 'Session Plan', content: 'Old content' }],
                role: 'player',
                status: 'active',
            },
            {
                userId: 'bcf390df-6bc7-47be-bd72-e6de9a7e21e1',
                characterIds: [],
                notes: [{ title: 'Session Plan', content: 'Other player content' }],
                role: 'player',
                status: 'active',
            },
        ] as any;
        campaign.infos.journal = [
            {
                postId: '12cd093b-0a8a-42fe-910f-001f2ab28450',
                title: 'Campaign journal',
                content: 'Campaign content',
                author: campaign.campaignPlayers[0],
                timestamp: new Date().toISOString(),
                category: 'players',
            } as any,
        ];
        campaign.infos.highlightedJournal = campaign.infos.journal[0] as any;
    });

    it('should update only the authenticated player note content', async () => {
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/notes?title=Session%20Plan`)
            .send({ content: 'New content' })
            .expect(HttpStatusCode.OK);

        expect(body).to.include({
            title: 'Session Plan',
            content: 'New content',
        });

        const { body: players } = await requester()
            .get(`/campaigns/${campaign.campaignId as string}/players`)
            .expect(HttpStatusCode.OK);

        expect(players[0].notes[0]).to.include({ title: 'Session Plan', content: 'New content' });
        expect(players[1].notes[0]).to.include({ title: 'Session Plan', content: 'Other player content' });
    });

    it('should remove only the authenticated player note', async () => {
        await InjectNewCampaign(campaign);

        await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/notes/remove?title=Session%20Plan`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: players } = await requester()
            .get(`/campaigns/${campaign.campaignId as string}/players`)
            .expect(HttpStatusCode.OK);

        expect(players[0].notes).to.deep.equal([]);
        expect(players[1].notes[0]).to.include({ title: 'Session Plan', content: 'Other player content' });
    });

    it('should return 404 when the title does not exist for the authenticated player', async () => {
        campaign.campaignPlayers[0].notes = [];
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/notes?title=Session%20Plan`)
            .send({ content: 'New content' })
            .expect(HttpStatusCode.NOT_FOUND);

        expect(body.message).to.equal('This content do not exist in the RPG system');
    });
});
