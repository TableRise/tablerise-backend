import sinon from 'sinon';
import UpdateMatchMapImagesService from 'src/core/campaigns/services/UpdateMatchMapImagesService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateMatchMapImagesService', () => {
    let updateMatchMapImagesService: UpdateMatchMapImagesService,
        campaignsRepository: any,
        updateMatchMapPayload: any,
        imageStorageClient: any,
        campaignMapImagesLength: number,
        campaign: Campaign;

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
                    mapImages: [{}],
                };

                updateMatchMapImagesService = new UpdateMatchMapImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const matchDataUpdated = await updateMatchMapImagesService.updateMatchMapImage(updateMatchMapPayload);
                expect(matchDataUpdated.matchData?.mapImages.length).to.be.not.equal(campaignMapImagesLength);
                expect(matchDataUpdated.matchData?.mapImages.length).to.be.equal(campaignMapImagesLength + 1);
            });
        });

        it('should skip uploads when map images are not provided', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            campaignsRepository = {
                findOne: () => ({ ...campaign }),
            };

            imageStorageClient = {
                upload: sinon.spy(),
            };

            updateMatchMapImagesService = new UpdateMatchMapImagesService({
                logger,
                campaignsRepository,
                imageStorageClient,
            });

            const matchDataUpdated = await updateMatchMapImagesService.updateMatchMapImage({
                campaignId: campaign.campaignId,
                mapImages: undefined as any,
            });

            expect(matchDataUpdated.matchData?.mapImages.length).to.equal(campaign.matchData?.mapImages.length);
            expect(imageStorageClient.upload).not.to.have.been.called;
        });

        it('should skip uploads when matchData is missing', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            campaignsRepository = {
                findOne: () => ({ ...campaign, matchData: null }),
            };

            imageStorageClient = {
                upload: sinon.spy(),
            };

            updateMatchMapImagesService = new UpdateMatchMapImagesService({
                logger,
                campaignsRepository,
                imageStorageClient,
            });

            const matchDataUpdated = await updateMatchMapImagesService.updateMatchMapImage({
                campaignId: campaign.campaignId,
                mapImages: [{}],
            } as any);

            expect(matchDataUpdated.matchData).to.equal(null);
            expect(imageStorageClient.upload).not.to.have.been.called;
        });
    });

    context('#save', () => {
        context('When a campaign with new map image is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                if (campaign.matchData) campaign.matchData.mapImages = [DomainDataFaker.generateImagesObjectJSON()[0]];

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
                const saveCamapaignTest = await updateMatchMapImagesService.save(campaign);

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
