import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import RemoveCampaignPlayerNoteService from 'src/core/campaigns/services/RemoveCampaignPlayerNoteService';

describe('Core :: Campaigns :: Services :: RemoveCampaignPlayerNoteService', () => {
    let campaign: Campaign;
    let campaignsRepository: any;
    let service: RemoveCampaignPlayerNoteService;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: 'player-id',
                characterIds: [],
                notes: [
                    { title: 'Session Plan', content: 'Old content' },
                    { title: 'Loot', content: 'Gold pieces' },
                ],
                role: 'player',
                status: 'active',
            },
            {
                userId: 'other-player-id',
                characterIds: [],
                notes: [{ title: 'Session Plan', content: 'Other player note' }],
                role: 'player',
                status: 'active',
            },
        ] as any;

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        service = new RemoveCampaignPlayerNoteService({
            campaignsRepository,
            logger,
        } as any);
    });

    it('should remove only the matching note from the authenticated player', async () => {
        const result = await service.removeNote({
            campaignId: campaign.campaignId as string,
            userId: 'player-id',
            title: 'Session Plan',
        });

        expect(result.campaignPlayers[0].notes).to.deep.equal([{ title: 'Loot', content: 'Gold pieces' }]);
        expect(result.campaignPlayers[1].notes).to.deep.equal([
            { title: 'Session Plan', content: 'Other player note' },
        ]);
    });

    it('should reject when the note title does not exist for the player', async () => {
        let thrownError;

        try {
            await service.removeNote({
                campaignId: campaign.campaignId as string,
                userId: 'player-id',
                title: 'Missing note',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.equal('This content do not exist in the RPG system');
    });

    it('should reject when the player is not in the campaign', async () => {
        let thrownError;

        try {
            await service.removeNote({
                campaignId: campaign.campaignId as string,
                userId: 'missing-player',
                title: 'Session Plan',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.equal('This player is not in the campaign');
    });

    it('should initialize notes when missing and still reject unknown titles', async () => {
        campaign.campaignPlayers[0].notes = undefined as any;

        let thrownError;

        try {
            await service.removeNote({
                campaignId: campaign.campaignId as string,
                userId: 'player-id',
                title: 'Session Plan',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.equal('This content do not exist in the RPG system');
    });

    it('should persist campaign updates in save', async () => {
        const result = await service.save(campaign);

        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
        expect(result).to.equal(campaign);
    });
});
