import CreateCampaignService from 'src/core/campaigns/services/CreateCampaignService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import DomainDataFakerUsers from 'src/infra/datafakers/users/DomainDataFaker';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Campaigns :: Services :: CreateCampaignService', () => {
    let createCampaignService: CreateCampaignService,
        serializer: any,
        imageStorageClient: any,
        campaignsRepository: any,
        usersDetailsRepository: any,
        userDetails: any,
        campaign: Campaign,
        image: FileObject,
        userId: any;

    const logger = (): void => {};

    context('#Serialize', () => {
        context('When serialize with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = DomainDataFakerUsers.generateUserDetailsJSON()[0];

                serializer = {
                    postCampaign: () => campaign,
                };

                campaignsRepository = {
                    find: () => [],
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
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
                    usersDetailsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const campaignSerialized = await createCampaignService.serialize(campaign);

                expect(campaignSerialized.campaignId).to.be.equal(campaign.campaignId);
            });
        });
    });

    context('#Enriched', () => {
        context('When enrich with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = DomainDataFakerUsers.generateUserDetailsJSON()[0];

                userId = newUUID();

                campaign.createdAt = null as unknown as string;
                campaign.updatedAt = null as unknown as string;
                campaign.musics = '[]' as unknown as typeof campaign.musics;
                campaign.configurations = JSON.stringify(
                    campaign.configurations
                ) as unknown as typeof campaign.configurations;
                campaign.socialMedia = JSON.stringify(
                    campaign.infos.socialMedia ?? {}
                ) as unknown as typeof campaign.socialMedia;

                serializer = {};

                campaignsRepository = {
                    find: () => [],
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
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
                    usersDetailsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const campaignEnriched = await createCampaignService.enrichment(campaign, userId, image);

                expect(campaignEnriched.campaignPlayers[0].userId).to.be.equal(userId);
                expect(campaignEnriched.createdAt).to.be.not.null();
                expect(campaignEnriched.updatedAt).to.be.not.null();
            });

            it('should return the correct result without image', async () => {
                campaign.musics = '[]' as unknown as typeof campaign.musics;
                campaign.configurations = JSON.stringify({
                    xpSystem: false,
                    shopSystem: false,
                }) as unknown as typeof campaign.configurations;
                campaign.socialMedia = JSON.stringify({}) as unknown as typeof campaign.socialMedia;
                const campaignEnriched = await createCampaignService.enrichment(campaign, userId);

                expect(campaignEnriched.campaignPlayers[0].userId).to.be.equal(userId);
                expect(campaignEnriched.createdAt).to.be.not.null();
                expect(campaignEnriched.updatedAt).to.be.not.null();
            });

            it('should return the correct result with mapImages', async () => {
                campaign.musics = '[]' as unknown as typeof campaign.musics;
                campaign.configurations = JSON.stringify({
                    xpSystem: false,
                    shopSystem: false,
                }) as unknown as typeof campaign.configurations;
                campaign.socialMedia = JSON.stringify({}) as unknown as typeof campaign.socialMedia;
                const mapImages = [image, image] as FileObject[];
                const campaignEnriched = await createCampaignService.enrichment(campaign, userId, image, mapImages);

                expect(campaignEnriched.campaignPlayers[0].userId).to.be.equal(userId);
                expect(campaignEnriched.matchData.mapImages).to.have.lengthOf(2);
            });

            it('should return the correct result without password', async () => {
                campaign.musics = '[]' as unknown as typeof campaign.musics;
                campaign.password = '' as unknown as string;
                campaign.configurations = JSON.stringify({
                    xpSystem: false,
                    shopSystem: false,
                }) as unknown as typeof campaign.configurations;
                campaign.socialMedia = JSON.stringify({}) as unknown as typeof campaign.socialMedia;
                const campaignEnriched = await createCampaignService.enrichment(campaign, userId);

                expect(campaignEnriched.campaignPlayers[0].userId).to.be.equal(userId);
                expect(campaignEnriched.createdAt).to.be.not.null();
            });

            it('should accept object social media and string booleans', async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                campaign.createdAt = null as unknown as string;
                campaign.updatedAt = null as unknown as string;
                campaign.musics = '[]' as unknown as typeof campaign.musics;
                campaign.configurations = JSON.stringify({
                    xpSystem: 'true',
                    shopSystem: 'true',
                }) as unknown as typeof campaign.configurations;
                campaign.socialMedia = { twitch: 'live' } as any;

                const campaignEnriched = await createCampaignService.enrichment(campaign, userId);

                expect(campaignEnriched.infos.socialMedia).to.deep.equal({ twitch: 'live' });
                expect(campaignEnriched.configurations).to.deep.equal({
                    xpSystem: true,
                    shopSystem: true,
                    shopOn: true,
                });
            });

            it('should default social media to an empty object when it is undefined', async () => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                campaign.createdAt = null as unknown as string;
                campaign.updatedAt = null as unknown as string;
                campaign.musics = '[]' as unknown as typeof campaign.musics;
                campaign.configurations = JSON.stringify({
                    xpSystem: false,
                    shopSystem: false,
                }) as unknown as typeof campaign.configurations;
                campaign.socialMedia = undefined as any;

                const campaignEnriched = await createCampaignService.enrichment(campaign, userId);

                expect(campaignEnriched.infos.socialMedia).to.deep.equal({});
            });
        });
    });

    context('#Save', () => {
        context('When save with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = DomainDataFakerUsers.generateUserDetailsJSON()[0];
                userDetails.gameInfo.campaigns = Array.from({ length: 9 }, (_, index) => ({
                    campaignId: `existing-${index}`,
                    notes: [],
                })) as any;
                userDetails.gameInfo.badges = [];
                userDetails.gameInfo.campaignsCreatedAmount = 1;

                serializer = {};

                campaignsRepository = {
                    create: () => campaign,
                    update: () => {},
                };

                usersDetailsRepository = {
                    findOne: () => userDetails,
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
                    usersDetailsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                const campaignSaved = await createCampaignService.save(campaign);

                expect(campaignSaved).to.be.deep.equal(campaign);
                expect(userDetails.gameInfo.campaignsCreatedAmount).to.equal(2);
                expect(userDetails.gameInfo.badges).to.deep.equal(['cleric-badge']);
            });
        });

        it('should reject when the owner user details do not exist', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaignsRepository = {
                create: () => campaign,
            };
            usersDetailsRepository = {
                findOne: () => null,
                update: () => {},
            };

            createCampaignService = new CreateCampaignService({
                serializer: {},
                campaignsRepository,
                usersDetailsRepository,
                imageStorageClient: {},
                logger,
            } as any);

            let thrownError;

            try {
                await createCampaignService.save(campaign);
            } catch (error) {
                thrownError = error;
            }

            expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        });
    });
});
