import sinon from 'sinon';
import UpdateCampaignImagesService from 'src/core/campaigns/services/UpdateCampaignImagesService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateCampaignImagesService', () => {
    let updateCampaignImagesService: UpdateCampaignImagesService,
        campaignsRepository: any,
        updateCampaignImagePayload: any,
        imageStorageClient: any,
        campaignMapImagesLength: number,
        campaign: Campaign;

    const logger = (): void => {};

    context('#updateCampaignImage', () => {
        context('When a map image is added to campaign images data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignMapImagesLength = campaign.images.maps.length ?? 0;

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

                updateCampaignImagePayload = {
                    campaignId: campaign.campaignId,
                    picture: {},
                    operation: 'add',
                };

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const campaignDataUpdated = await updateCampaignImagesService.updateCampaignImage(
                    updateCampaignImagePayload
                );
                expect(campaignDataUpdated.images.maps.length).to.be.not.equal(campaignMapImagesLength);
                expect(campaignDataUpdated.images.maps.length).to.be.equal(campaignMapImagesLength + 1);
            });
        });

        context('When a map image is removed from campaign images', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.images.maps = [
                    {
                        id: '789',
                        link: 'https://img.bb',
                        uploadDate: '2023-03-27Z14:13',
                        title: '',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    },
                ];

                campaignMapImagesLength = campaign.images.maps.length ?? 0;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {};

                updateCampaignImagePayload = {
                    campaignId: campaign.campaignId,
                    imageId: '789',
                    operation: 'remove',
                };

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const campaignDataUpdated = await updateCampaignImagesService.updateCampaignImage(
                    updateCampaignImagePayload
                );
                expect(campaignDataUpdated.images.maps.length).to.be.not.equal(campaignMapImagesLength);
                expect(campaignDataUpdated.images.maps.length).to.be.equal(campaignMapImagesLength - 1);
            });
        });

        context('When a map image is added with a name param provided', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignMapImagesLength = campaign.images.maps.length ?? 0;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '456',
                            link: 'https://img.bb/char',
                        },
                    }),
                };

                updateCampaignImagePayload = {
                    campaignId: campaign.campaignId,
                    picture: {},
                    operation: 'add',
                };

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign with map image added', async () => {
                const campaignDataUpdated = await updateCampaignImagesService.updateCampaignImage(
                    updateCampaignImagePayload
                );
                expect(campaignDataUpdated.images.maps.length).to.be.not.equal(campaignMapImagesLength);
                expect(campaignDataUpdated.images.maps.length).to.be.equal(campaignMapImagesLength + 1);
            });
        });

        context('When a map image is removed by id', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.images.maps = [
                    {
                        id: '999',
                        title: '',
                        link: 'https://img.bb/map2',
                        uploadDate: '2023-03-27Z14:13',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    },
                ];

                campaignMapImagesLength = campaign.images.maps.length ?? 0;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {};

                updateCampaignImagePayload = {
                    campaignId: campaign.campaignId,
                    imageId: '999',
                    operation: 'remove',
                };

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign with map image removed', async () => {
                const campaignDataUpdated = await updateCampaignImagesService.updateCampaignImage(
                    updateCampaignImagePayload
                );
                expect(campaignDataUpdated.images.maps.length).to.be.not.equal(campaignMapImagesLength);
                expect(campaignDataUpdated.images.maps.length).to.be.equal(campaignMapImagesLength - 1);
            });
        });
    });

    context('#save', () => {
        context('When a campaign with new map image is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.images.maps = [
                    {
                        id: '789',
                        link: 'https://img.bb',
                        uploadDate: '2023-03-27Z14:13',
                        title: '',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    },
                ];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                imageStorageClient = {};

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await updateCampaignImagesService.save(campaign);

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
