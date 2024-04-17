import sinon from 'sinon';
import UpdateMatchMapImagesOperation from 'src/core/campaigns/operations/UpdateMatchMapImagesOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateMatchMapImagesOperation', () => {
    let updateMatchMapImagesOperation: UpdateMatchMapImagesOperation,
        updateMatchMapImagesService: any,
        matchMapImagesPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign has the match map images', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                matchMapImagesPayload = {
                    campaignId: campaign.campaignId,
                    operation: 'add',
                    mapImage: {},
                };

                campaign.matchData.mapImages = [
                    {
                        id: '123',
                        link: 'https://img.bb/',
                        uploadDate: '2023-12-12Z10:34',
                    },
                ];

                updateMatchMapImagesService = {
                    updateMatchMapImage: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateMatchMapImagesOperation = new UpdateMatchMapImagesOperation({
                    updateMatchMapImagesService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateMapImagesTest = await updateMatchMapImagesOperation.execute(
                    matchMapImagesPayload
                );

                expect(
                    updateMatchMapImagesService.updateMatchMapImage
                ).to.have.been.called();
                expect(updateMatchMapImagesService.save).to.have.been.called();
                expect(updateMapImagesTest[0]).to.have.property('id');
                expect(updateMapImagesTest[0].id).to.be.equal(
                    campaign.matchData.mapImages[0].id
                );
            });
        });
    });
});
