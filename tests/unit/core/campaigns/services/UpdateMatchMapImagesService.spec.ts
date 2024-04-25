import sinon from 'sinon';
import UpdateMatchMapImagesService from 'src/core/campaigns/services/UpdateMatchMapImagesService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateMatchMapImagesService', () => {
    let updateMatchMapImagesService: UpdateMatchMapImagesService,
        campaignsRepository: any,
        updateMatchMapPayload: any,
        imageStorageClient: any,
        campaignMapImagesLength: number,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#updateMatchMapImage', () => {
        context('When a map image is added to match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignMapImagesLength = campaign.matchData?.mapImages.length ?? 0;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://img.bb',
                        },
                    }),
                };

                updateMatchMapPayload = {
                    campaignId: campaign.campaignId,
                    mapImage: {},
                    operation: 'add',
                };

                updateMatchMapImagesService = new UpdateMatchMapImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated =
                    await updateMatchMapImagesService.updateMatchMapImage(
                        updateMatchMapPayload
                    );
                expect(matchDataUpdated.matchData?.mapImages.length).to.be.not.equal(
                    campaignMapImagesLength
                );
                expect(matchDataUpdated.matchData?.mapImages.length).to.be.equal(
                    campaignMapImagesLength + 1
                );
            });
        });

        context('When a map image is removed from match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                if (campaign.matchData)
                    campaign.matchData.mapImages = [
                        {
                            id: '789',
                            link: 'https://img.bb',
                            uploadDate: '2023-03-27Z14:13',
                        },
                    ];

                campaignMapImagesLength = campaign.matchData?.mapImages.length ?? 0;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {};

                updateMatchMapPayload = {
                    campaignId: campaign.campaignId,
                    operation: 'remove',
                    imageId: '789',
                };

                updateMatchMapImagesService = new UpdateMatchMapImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated =
                    await updateMatchMapImagesService.updateMatchMapImage(
                        updateMatchMapPayload
                    );
                expect(matchDataUpdated.matchData?.mapImages.length).to.be.not.equal(
                    campaignMapImagesLength
                );
                expect(matchDataUpdated.matchData?.mapImages.length).to.be.equal(
                    campaignMapImagesLength - 1
                );
            });
        });
    });

    context('#save', () => {
        context('When a campaign with new map image is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                if (campaign.matchData)
                    campaign.matchData.mapImages = [
                        {
                            id: '789',
                            link: 'https://img.bb',
                            uploadDate: '2023-03-27Z14:13',
                        },
                    ];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                imageStorageClient = {};

                updateMatchMapImagesService = new UpdateMatchMapImagesService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await updateMatchMapImagesService.save(
                    campaign
                );

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
