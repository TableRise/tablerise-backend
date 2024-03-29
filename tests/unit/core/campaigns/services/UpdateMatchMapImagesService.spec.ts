import UpdateMatchMapImagesService from 'src/core/campaigns/services/campaigns/UpdateMatchMapImagesService';
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

                campaignMapImagesLength = campaign.matchData.mapImages.length;

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
                expect(matchDataUpdated.matchData.mapImages.length).to.be.not.equal(
                    campaignMapImagesLength
                );
                expect(matchDataUpdated.matchData.mapImages.length).to.be.equal(
                    campaignMapImagesLength + 1
                );
            });
        });

        context('When a map image is removed from match data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.matchData.mapImages = [
                    {
                        id: '789',
                        link: 'https://img.bb',
                        uploadDate: '2023-03-27Z14:13',
                    },
                ];

                campaignMapImagesLength = campaign.matchData.mapImages.length;

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
                expect(matchDataUpdated.matchData.mapImages.length).to.be.not.equal(
                    campaignMapImagesLength
                );
                expect(matchDataUpdated.matchData.mapImages.length).to.be.equal(
                    campaignMapImagesLength - 1
                );
            });
        });
    });
});
