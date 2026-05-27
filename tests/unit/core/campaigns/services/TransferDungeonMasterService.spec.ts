import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import TransferDungeonMasterService from 'src/core/campaigns/services/TransferDungeonMasterService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: TransferDungeonMasterService', () => {
    const logger = (): void => {};

    it('should transfer the dungeon master role to the target player', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            { userId: 'dm-id', characterIds: [], role: 'dungeon_master', status: 'active' },
            { userId: 'player-id', characterIds: [], role: 'player', status: 'active' },
            { userId: 'other-id', characterIds: [], role: 'player', status: 'active' },
        ] as any;

        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new TransferDungeonMasterService({
            campaignsRepository,
            logger,
        } as any);

        const updated = await service.transfer(campaign.campaignId as string, 'dm-id', 'player-id');

        expect(updated.campaignPlayers[0].role).to.equal('player');
        expect(updated.campaignPlayers[1].role).to.equal('dungeon_master');
        expect(updated.campaignPlayers[2].role).to.equal('player');
    });

    it('should reject when the target player does not exist', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            { userId: 'dm-id', characterIds: [], role: 'dungeon_master', status: 'active' },
        ] as any;

        const service = new TransferDungeonMasterService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub(),
            },
            logger,
        } as any);

        let thrownError;

        try {
            await service.transfer(campaign.campaignId as string, 'dm-id', 'missing-id');
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).to.be.instanceOf(HttpRequestErrors);
    });
});
