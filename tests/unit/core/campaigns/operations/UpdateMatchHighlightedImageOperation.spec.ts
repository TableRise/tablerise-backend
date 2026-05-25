import sinon from 'sinon';
import UpdateMatchHighlightedImageOperation from 'src/core/campaigns/operations/UpdateMatchHighlightedImageOperation';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchHighlightedImageOperation', () => {
    let updateMatchHighlightedImageOperation: UpdateMatchHighlightedImageOperation,
        updateMatchHighlightedImageService: any,
        payload: any,
        campaign: Campaign;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = [DomainDataFaker.generateImagesObjectJSON()[0]];
        campaign.matchData.imageHighlighted = campaign.matchData.images[0] as any;

        payload = {
            campaignId: campaign.campaignId,
            imageId: campaign.matchData.images[0].id,
        };

        updateMatchHighlightedImageService = {
            updateMatchHighlightedImage: sinon.stub().resolves(campaign),
            save: sinon.stub().resolves(campaign),
        };

        updateMatchHighlightedImageOperation = new UpdateMatchHighlightedImageOperation({
            updateMatchHighlightedImageService,
            socketIO,
            logger,
        });
    });

    it('should save, sync cache, and emit highlight update', async () => {
        const imageHighlighted = await updateMatchHighlightedImageOperation.execute(payload);

        expect(updateMatchHighlightedImageService.updateMatchHighlightedImage).to.have.been.calledWith(payload);
        expect(updateMatchHighlightedImageService.save).to.have.been.calledWith(campaign);
        expect(socketIO.syncActiveCampaign).to.have.been.calledWith(campaign);
        expect(socketIO.emitToCampaign).to.have.been.calledWith(payload.campaignId, 'match:image_highlighted_changed', {
            campaignId: payload.campaignId,
            imageHighlighted: campaign.matchData.imageHighlighted,
        });
        expect(imageHighlighted).to.deep.equal(campaign.matchData.imageHighlighted);
    });

    it('should emit null when removing the highlighted image', async () => {
        campaign.matchData.imageHighlighted = null as any;
        updateMatchHighlightedImageService.updateMatchHighlightedImage = sinon.stub().resolves(campaign);
        updateMatchHighlightedImageService.save = sinon.stub().resolves(campaign);

        const imageHighlighted = await updateMatchHighlightedImageOperation.execute({
            campaignId: campaign.campaignId,
            remove: true,
        });

        expect(socketIO.emitToCampaign).to.have.been.calledWith(
            campaign.campaignId,
            'match:image_highlighted_changed',
            {
                campaignId: campaign.campaignId,
                imageHighlighted: null,
            }
        );
        expect(imageHighlighted).to.equal(null);
    });
});
