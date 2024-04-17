import sinon from 'sinon';
import UpdateCampaignService from 'src/core/campaigns/services/UpdateCampaignService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: UpdateCampaignService', () => {
    let updateCampaignService: UpdateCampaignService,
        campaign: any,
        campaignUpdatePayload: any,
        campaignsRepository: any,
        imageStorageClient: any;

    const logger = (): void => {};

    context('#update', () => {
        context('When a campaign is updated', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://youtube.com/',
                            uploadDate: '2023-03-31Z17:58:00',
                        },
                    }),
                };

                campaignUpdatePayload = {
                    title: 'New title',
                    description: 'New description text',
                    visibility: 'hidden',
                };

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return correct data', async () => {
                const campaignUpdateTest = await updateCampaignService.update(
                    campaignUpdatePayload
                );
                expect(campaignUpdateTest.title).to.be.equal(campaignUpdatePayload.title);
                expect(campaignUpdateTest.description).to.be.equal(
                    campaignUpdatePayload.description
                );
                expect(campaignUpdateTest.infos.visibility).to.be.equal(
                    campaignUpdatePayload.visibility
                );
            });
        });

        context('When a campaign is updated - with cover', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://youtube.com/',
                        },
                    }),
                };

                campaignUpdatePayload = {
                    title: 'New title',
                    description: 'New description text',
                    visibility: 'hidden',
                    cover: {},
                };

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return correct data', async () => {
                const campaignUpdateTest = await updateCampaignService.update(
                    campaignUpdatePayload
                );

                expect(campaignUpdateTest.title).to.be.equal(campaignUpdatePayload.title);
                expect(campaignUpdateTest.description).to.be.equal(
                    campaignUpdatePayload.description
                );
                expect(campaignUpdateTest.infos.visibility).to.be.equal(
                    campaignUpdatePayload.visibility
                );

                if (typeof campaignUpdatePayload.cover !== 'string') {
                    // @ts-expect-error Will exist
                    expect(campaignUpdateTest.cover?.id).to.be.equal('123');
                    expect(campaignUpdateTest.cover?.link).to.be.equal(
                        'https://youtube.com/'
                    );
                    expect(campaignUpdateTest.cover).to.have.property('uploadDate');
                }
            });
        });

        context('When a campaign is updated - without new infos', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {};

                campaignUpdatePayload = {};

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return correct data', async () => {
                const campaignUpdateTest = await updateCampaignService.update(
                    campaignUpdatePayload
                );
                expect(campaignUpdateTest.title).to.be.equal(campaign.title);
                expect(campaignUpdateTest.description).to.be.equal(campaign.description);
                expect(campaignUpdateTest.infos.visibility).to.be.equal(
                    campaign.infos.visibility
                );
            });
        });
    });

    context('#save', () => {
        context('When an updated campaign is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                imageStorageClient = {};

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should call correct methods and have correct return', async () => {
                const campaignUpdatedSaved = await updateCampaignService.save(campaign);
                expect(campaignUpdatedSaved).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
