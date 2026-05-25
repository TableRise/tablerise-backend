import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DeleteCharacterOperation from 'src/core/characters/operations/DeleteCharacterOperation';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Characters :: Operations :: DeleteCharacterOperation', () => {
    let deleteCharacterOperation: DeleteCharacterOperation;
    let deleteCharacterService: any;
    let socketIO: any;
    let campaign: Campaign;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        socketIO = {
            syncActiveCampaign: sinon.stub(),
        };
    });

    it('should sync the active campaign when the deleted character belonged to one', async () => {
        deleteCharacterService = {
            delete: sinon.stub().resolves(campaign),
        };

        deleteCharacterOperation = new DeleteCharacterOperation({
            deleteCharacterService,
            socketIO,
            logger,
        } as any);

        await deleteCharacterOperation.execute({
            characterId: 'character-1',
            userId: 'owner-user',
        });

        expect(deleteCharacterService.delete).to.have.been.calledWith({
            characterId: 'character-1',
            userId: 'owner-user',
        });
        expect(socketIO.syncActiveCampaign).to.have.been.calledWith(campaign);
    });

    it('should not sync campaigns when the deleted character was not attached to one', async () => {
        deleteCharacterService = {
            delete: sinon.stub().resolves(null),
        };

        deleteCharacterOperation = new DeleteCharacterOperation({
            deleteCharacterService,
            socketIO,
            logger,
        } as any);

        await deleteCharacterOperation.execute({
            characterId: 'character-1',
            userId: 'owner-user',
        });

        expect(socketIO.syncActiveCampaign).to.not.have.been.called();
    });
});
