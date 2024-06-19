import sinon from 'sinon';
import UpdateCampaignImagesService from 'src/core/campaigns/services/UpdateCampaignImagesService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateCampaignImagesService', () => {
    let updateCampaignImagesService: UpdateCampaignImagesService,
        campaignsRepository: any,
        updateCampaignImagePayload: any,
        imageStorageClient: any,
        campaignMapImagesLength: number,
        campaignCharactersImagesLength: number,
        campaign: CampaignInstance;

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
                    image: {},
                    operation: 'add',
                };

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const campaignDataUpdated =
                    await updateCampaignImagesService.updateCampaignImage(
                        updateCampaignImagePayload
                    );
                expect(campaignDataUpdated.images.maps.length).to.be.not.equal(
                    campaignMapImagesLength
                );
                expect(campaignDataUpdated.images.maps.length).to.be.equal(
                    campaignMapImagesLength + 1
                );
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
                const campaignDataUpdated =
                    await updateCampaignImagesService.updateCampaignImage(
                        updateCampaignImagePayload
                    );
                expect(campaignDataUpdated.images.maps.length).to.be.not.equal(
                    campaignMapImagesLength
                );
                expect(campaignDataUpdated.images.maps.length).to.be.equal(
                    campaignMapImagesLength - 1
                );
            });
        });

        context('When a character image is added to campaign images data', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignCharactersImagesLength = campaign.images.characters.length ?? 0;

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
                    name: 'character',
                    image: {},
                    operation: 'add',
                };

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const campaignDataUpdated =
                    await updateCampaignImagesService.updateCampaignImage(
                        updateCampaignImagePayload
                    );
                expect(campaignDataUpdated.images.characters.length).to.be.not.equal(
                    campaignCharactersImagesLength
                );
                expect(campaignDataUpdated.images.characters.length).to.be.equal(
                    campaignCharactersImagesLength + 1
                );
            });
        });

        context('When a character image is removed from campaign images', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaign.images.characters = [
                    {
                        id: '789',
                        title: 'character',
                        link: 'https://img.bb',
                        uploadDate: '2023-03-27Z14:13',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    },
                ];

                campaignCharactersImagesLength = campaign.images.characters.length ?? 0;

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {};

                updateCampaignImagePayload = {
                    campaignId: campaign.campaignId,
                    imageId: '789',
                    name: 'character',
                    operation: 'remove',
                };

                updateCampaignImagesService = new UpdateCampaignImagesService({
                    logger,
                    campaignsRepository,
                    imageStorageClient,
                });
            });

            it('should return the updated campaign', async () => {
                const campaignDataUpdated =
                    await updateCampaignImagesService.updateCampaignImage(
                        updateCampaignImagePayload
                    );
                expect(campaignDataUpdated.images.characters.length).to.be.not.equal(
                    campaignCharactersImagesLength
                );
                expect(campaignDataUpdated.images.characters.length).to.be.equal(
                    campaignCharactersImagesLength - 1
                );
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
                const saveCamapaignTest = await updateCampaignImagesService.save(
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
