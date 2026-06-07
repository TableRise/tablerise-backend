import sinon from 'sinon';
import UpdateMatchImagesOperation from 'src/core/campaigns/operations/UpdateMatchImagesOperation';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchImagesOperation', () => {
    let updateMatchImagesOperation: UpdateMatchImagesOperation,
        updateMatchImagesService: any,
        payload: any,
        campaign: Campaign;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = [DomainDataFaker.generateImagesObjectJSON()[0]];

        payload = {
            campaignId: campaign.campaignId,
            userId: 'user-1',
            images: [{}],
        };

        updateMatchImagesService = {
            updateMatchImages: sinon.stub().resolves(campaign),
            save: sinon.stub().resolves(campaign),
        };

        updateMatchImagesOperation = new UpdateMatchImagesOperation({
            updateMatchImagesService,
            socketIO,
            logger,
        });
    });

    it('should save, sync cache, and emit images update', async () => {
        const images = await updateMatchImagesOperation.execute(payload);

        expect(updateMatchImagesService.updateMatchImages).to.have.been.calledWith(payload);
        expect(updateMatchImagesService.save).to.have.been.calledWith(campaign);
        expect(socketIO.syncActiveCampaign).to.have.been.calledWith(campaign);
        expect(socketIO.emitToCampaign).to.have.been.calledWith(payload.campaignId, 'campaign:images_updated', {
            campaignId: payload.campaignId,
            images: campaign.matchData.images,
        });
        expect(images).to.deep.equal(campaign.matchData.images);
    });
});
