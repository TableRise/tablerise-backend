import sinon from 'sinon';
import UpdateCampaignImagesOperation from 'src/core/campaigns/operations/UpdateCampaignImagesOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateCampaignImagesOperation', () => {
    let updateCampaignImagesOperation: UpdateCampaignImagesOperation,
        updateCampaignImagesService: any,
        CampaignImagesPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a campaign has the map images', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                CampaignImagesPayload = {
                    campaignId: campaign.campaignId,
                    operation: 'add',
                    image: {},
                };

                campaign.images.maps = [
                    {
                        id: '123',
                        link: 'https://img.bb/',
                        uploadDate: '2023-12-12Z10:34',
                        title: '',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    },
                ];

                updateCampaignImagesService = {
                    updateCampaignImage: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateCampaignImagesOperation = new UpdateCampaignImagesOperation({
                    updateCampaignImagesService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateImagesTest = await updateCampaignImagesOperation.execute(
                    CampaignImagesPayload
                );

                expect(
                    updateCampaignImagesService.updateCampaignImage
                ).to.have.been.called();
                expect(updateCampaignImagesService.save).to.have.been.called();
                expect(updateImagesTest.maps[0]).to.have.property('id');
                expect(updateImagesTest.maps[0].id).to.be.equal(
                    campaign.images.maps[0].id
                );
            });
        });

        context('When a campaign has the character images', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                CampaignImagesPayload = {
                    campaignId: campaign.campaignId,
                    name: 'character',
                    operation: 'add',
                    image: {},
                };

                campaign.images.characters = [
                    {
                        id: '123',
                        title: 'character',
                        link: 'https://img.bb/',
                        uploadDate: '2023-12-12Z10:34',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    },
                ];

                updateCampaignImagesService = {
                    updateCampaignImage: sinon.spy(),
                    save: sinon.spy(() => campaign),
                };

                updateCampaignImagesOperation = new UpdateCampaignImagesOperation({
                    updateCampaignImagesService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const updateImagesTest = await updateCampaignImagesOperation.execute(
                    CampaignImagesPayload
                );

                expect(
                    updateCampaignImagesService.updateCampaignImage
                ).to.have.been.called();
                expect(updateCampaignImagesService.save).to.have.been.called();
                expect(updateImagesTest.characters[0]).to.have.property('id');
                expect(updateImagesTest.characters[0].id).to.be.equal(
                    campaign.images.characters[0].id
                );
            });
        });
    });
});
