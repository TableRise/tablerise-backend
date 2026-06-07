import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import sinon from 'sinon';
import CreateCampaignOperation from 'src/core/campaigns/operations/CreateCampaignOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Campaigns :: Operations :: CreateCampaignOperation', () => {
    let createCampaignOperation: CreateCampaignOperation,
        createCampaignService: any,
        campaignToCreate: any,
        campaignCreated: any,
        userId: any;

    const logger = (): void => {};

    context('When a new campaign is created with success', () => {
        before(() => {
            userId = newUUID();

            campaignCreated = DomainDataFaker.generateCampaignsJSON()[0];

            createCampaignService = {
                serialize: sinon.spy(() => ({
                    campaignSerialized: {},
                })),
                enrichment: sinon.spy(() => ({
                    campaignEnriched: {},
                })),
                saveWithGalleryOptions: sinon.spy(() => campaignCreated),
            };

            createCampaignOperation = new CreateCampaignOperation({
                createCampaignService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const campaignTest = await createCampaignOperation.execute({
                campaign: campaignToCreate,
                userId,
            });

            expect(createCampaignService.serialize).to.have.been.called();
            expect(createCampaignService.enrichment).to.have.been.calledWith(
                {
                    campaignSerialized: {},
                },
                userId
            );
            expect(createCampaignService.saveWithGalleryOptions).to.have.been.calledWith(
                {
                    campaignEnriched: {},
                },
                {
                    appendCoverToGallery: false,
                    appendMapImagesToGallery: false,
                }
            );
            expect(campaignTest).to.be.deep.equal(campaignCreated);
        });

        it('should append uploaded cover and map images to gallery when files are provided', async () => {
            await createCampaignOperation.execute({
                campaign: campaignToCreate,
                userId,
                image: { originalname: 'cover.png' } as any,
                mapImages: [{ originalname: 'map.png' }] as any,
            });

            expect(createCampaignService.saveWithGalleryOptions).to.have.been.calledWith(
                {
                    campaignEnriched: {},
                },
                {
                    appendCoverToGallery: true,
                    appendMapImagesToGallery: true,
                }
            );
        });

        it('should skip gallery appends when imageObject overrides uploaded files', async () => {
            await createCampaignOperation.execute({
                campaign: campaignToCreate,
                userId,
                image: { originalname: 'cover.png' } as any,
                mapImages: [{ originalname: 'map.png' }] as any,
                imageObject: {
                    cover: {
                        id: 'cover-1',
                        title: '',
                        link: 'https://img.bb/cover',
                        uploadDate: new Date().toISOString(),
                        deleteUrl: '',
                    } as any,
                    mapImages: [
                        {
                            id: 'map-1',
                            title: '',
                            link: 'https://img.bb/map',
                            uploadDate: new Date().toISOString(),
                            deleteUrl: '',
                        } as any,
                    ],
                },
            });

            expect(createCampaignService.saveWithGalleryOptions).to.have.been.calledWith(
                {
                    campaignEnriched: {},
                },
                {
                    appendCoverToGallery: false,
                    appendMapImagesToGallery: false,
                }
            );
        });
    });

    context('When a new campaign creation fails', () => {
        before(() => {
            userId = newUUID();

            campaignCreated = DomainDataFaker.generateCampaignsJSON()[0];

            createCampaignService = {
                serialize: sinon.spy(() => {
                    throw new Error('some error');
                }),
                enrichment: sinon.spy(() => ({
                    campaignEnriched: {},
                })),
                saveWithGalleryOptions: sinon.spy(() => campaignCreated),
            };

            createCampaignOperation = new CreateCampaignOperation({
                createCampaignService,
                logger,
            });
        });

        it('should throw the correct error', async () => {
            try {
                await createCampaignOperation.execute({
                    campaign: campaignCreated,
                    userId,
                });
                expect('it should not be here').to.be.equal(false);
            } catch (error: any) {
                expect(error.message).to.be.equal('some error');
            }
        });
    });
});
