import sinon from 'sinon';
import UpdateMatchMapImagesOperation from 'src/core/campaigns/operations/UpdateMatchMapImagesOperation';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchMapImagesOperation', () => {
    let updateMatchMapImagesOperation: UpdateMatchMapImagesOperation,
        updateMatchMapImagesService: any,
        matchMapImagesPayload: any,
        campaign: Campaign;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

    context('#execute', () => {
        context('When a campaign has the match map images', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                matchMapImagesPayload = {
                    campaignId: campaign.campaignId,
                    mapImages: [{}],
                };

                if (campaign.matchData) campaign.matchData.mapImages = [DomainDataFaker.generateImagesObjectJSON()[0]];

                updateMatchMapImagesService = {
                    updateMatchMapImage: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateMatchMapImagesOperation = new UpdateMatchMapImagesOperation({
                    updateMatchMapImagesService,
                    socketIO,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateMapImagesTest = await updateMatchMapImagesOperation.execute(matchMapImagesPayload);

                expect(updateMatchMapImagesService.updateMatchMapImage).to.have.been.called();
                expect(updateMatchMapImagesService.save).to.have.been.called();
                expect(updateMapImagesTest[0]).to.have.property('id');
                expect(updateMapImagesTest[0].id).to.be.equal(campaign.matchData?.mapImages[0].id);
            });
        });
    });
});
