import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UpdateCampaignPlayerNoteService from 'src/core/campaigns/services/UpdateCampaignPlayerNoteService';

describe('Core :: Campaigns :: Services :: UpdateCampaignPlayerNoteService', () => {
    let campaign: Campaign;
    let campaignsRepository: any;
    let service: UpdateCampaignPlayerNoteService;

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

        service = new UpdateCampaignPlayerNoteService({
            campaignsRepository,
            logger,
        } as any);
    });

    it('should update only the content of the matching note', async () => {
        const result = await service.updateNote({
            campaignId: campaign.campaignId as string,
            userId: 'player-id',
            title: 'Session Plan',
            content: 'New content',
        });

        expect(result.updatedNote).to.deep.equal({
            title: 'Session Plan',
            content: 'New content',
        });
        expect(result.campaign.campaignPlayers[0].notes[1]).to.deep.equal({
            title: 'Loot',
            content: 'Gold pieces',
        });
        expect(result.campaign.campaignPlayers[1].notes[0]).to.deep.equal({
            title: 'Session Plan',
            content: 'Other player note',
        });
    });

    it('should reject when the authenticated user is not in the campaign', async () => {
        let thrownError;

        try {
            await service.updateNote({
                campaignId: campaign.campaignId as string,
                userId: 'missing-player',
                title: 'Session Plan',
                content: 'New content',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.equal('This player is not in the campaign');
    });

    it('should reject when the note title does not exist for the player', async () => {
        let thrownError;

        try {
            await service.updateNote({
                campaignId: campaign.campaignId as string,
                userId: 'player-id',
                title: 'Missing note',
                content: 'New content',
            });
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        expect((thrownError as HttpRequestErrors).message).to.equal('This content do not exist in the RPG system');
    });

    it('should reject when the player notes list is missing', async () => {
        campaign.campaignPlayers[0].notes = undefined as any;

        let thrownError;

        try {
            await service.updateNote({
                campaignId: campaign.campaignId as string,
                userId: 'player-id',
                title: 'Session Plan',
                content: 'New content',
            });
        } catch (error) {
            thrownError = error;
        }

        expect((thrownError as HttpRequestErrors).message).to.equal('This content do not exist in the RPG system');
    });

    it('should persist the updated campaign', async () => {
        const saved = await service.save(campaign);

        expect(saved).to.deep.equal(campaign);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });
});
