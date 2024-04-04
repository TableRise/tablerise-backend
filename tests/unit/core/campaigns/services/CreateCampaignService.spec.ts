import CreateCampaignService from 'src/core/campaigns/services/campaigns/CreateCampaignService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Campaigns :: Services :: CreateCampaignService', () => {
    let createCampaignService: CreateCampaignService,
        serializer: any,
        imageStorageClient: any,
        campaignsRepository: any,
        campaign: CampaignInstance,
        image: FileObject,
        userId: any;

    const logger = (): void => {};

    context('#Serialize', () => {
        context('When serialize with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                serializer = {
                    postCampaign: () => campaign,
                };

                campaignsRepository = {
                    find: () => [],
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://123.com',
                        },
                    }),
                };

                createCampaignService = new CreateCampaignService({
                    serializer,
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const campaignSerialized = await createCampaignService.serialize(
                    campaign
                );

                expect(campaignSerialized.campaignId).to.be.equal(campaign.campaignId);
            });
        });
    });

    context('#Enriched', () => {
        context('When enrich with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                userId = newUUID();

                campaign.createdAt = null as unknown as string;
                campaign.updatedAt = null as unknown as string;

                serializer = {};

                campaignsRepository = {
                    find: () => [],
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://123.com',
                        },
                    }),
                };

                image = {
                    fieldname: 'string',
                    originalname: 'string',
                    encoding: 'string',
                    mimetype: 'string',
                    buffer: 'any',
                    size: 1,
                };

                createCampaignService = new CreateCampaignService({
                    serializer,
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const campaignEnriched = await createCampaignService.enrichment(
                    campaign,
                    userId,
                    image
                );

                expect(campaignEnriched.campaignPlayers[0].userId).to.be.equal(userId);
                expect(campaignEnriched.createdAt).to.be.not.null();
                expect(campaignEnriched.updatedAt).to.be.not.null();
            });

            it('should return the correct result without image', async () => {
                const campaignEnriched = await createCampaignService.enrichment(
                    campaign,
                    userId
                );

                expect(campaignEnriched.campaignPlayers[0].userId).to.be.equal(userId);
                expect(campaignEnriched.createdAt).to.be.not.null();
                expect(campaignEnriched.updatedAt).to.be.not.null();
            });
        });
    });

    context('#Save', () => {
        context('When save with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                serializer = {};

                campaignsRepository = {
                    create: () => campaign,
                    update: () => {},
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://123.com',
                        },
                    }),
                };

                createCampaignService = new CreateCampaignService({
                    serializer,
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const campaignSaved = await createCampaignService.save(campaign);

                expect(campaignSaved).to.be.deep.equal(campaign);
            });
        });
    });
});
