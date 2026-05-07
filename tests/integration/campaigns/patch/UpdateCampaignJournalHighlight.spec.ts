import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { InjectNewCampaign } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When updating the highlighted journal post of a campaign', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    let campaign: Campaign;

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.infos.journal = [];
        campaign.infos.highlightedJournal = {} as Campaign['infos']['highlightedJournal'];
    });

    it('should store the provided post when toggle is on', async () => {
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        await InjectNewCampaign(campaign);

        const post = {
            title: 'Pinned note',
            author: campaign.campaignPlayers[0],
            content: 'Meet at the old tower.',
            timestamp: new Date().toISOString(),
            category: 'master',
        };

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/journal/highlight`)
            .send({ toggle: 'on', post })
            .expect(HttpStatusCode.OK);

        expect(body).to.be.deep.equal(post);
    });

    it('should clear the highlighted journal post when toggle is off', async () => {
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'admin_player',
                status: 'active',
            },
        ];
        campaign.infos.highlightedJournal = {
            title: 'Pinned note',
            author: campaign.campaignPlayers[0],
            content: 'Old content',
            timestamp: new Date().toISOString(),
            category: 'announcements',
        };
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/journal/highlight`)
            .send({ toggle: 'off' })
            .expect(HttpStatusCode.OK);

        expect(body).to.be.deep.equal({});
    });

    it('should reject toggle on without post', async () => {
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/journal/highlight`)
            .send({ toggle: 'on' })
            .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(body.message).to.be.equal('Schema error');
    });

    it('should reject regular players', async () => {
        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .patch(`/campaigns/${campaign.campaignId as string}/update/journal/highlight`)
            .send({ toggle: 'off' })
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.be.equal('The operation is forbidden for this role');
    });
});
