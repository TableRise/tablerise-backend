import CreateCampaignService from 'src/core/campaigns/services/campaigns/CreateCampaignService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: CreateCampaignService', () => {
    let createCampaignService: CreateCampaignService,
        campaignsSerializer: any,
        campaignsRepository: any,
        campaign: CampaignInstance,
        userId: any;

    const logger = (): void => {};

    context('#Serialize', () => {
        context('When serialize with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsSerializer = {
                    postCampaign: () => campaign,
                };

                campaignsRepository = {
                    find: () => [],
                };

                createCampaignService = new CreateCampaignService({
                    campaignsSerializer,
                    campaignsRepository,
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

                campaignsSerializer = {};

                campaignsRepository = {
                    find: () => [],
                };

                createCampaignService = new CreateCampaignService({
                    campaignsSerializer,
                    campaignsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
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

                campaignsSerializer = {};

                campaignsRepository = {
                    create: () => campaign,
                    update: () => {},
                };

                createCampaignService = new CreateCampaignService({
                    campaignsSerializer,
                    campaignsRepository,
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
