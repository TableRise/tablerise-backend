import sinon from 'sinon';
import UpdateCampaignOperation from 'src/core/campaigns/operations/UpdateCampaignOperation';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: UpdateCampaignOperation', () => {
    let updateCampaignOperation: UpdateCampaignOperation,
        campaign: any,
        campaignUpdated: any,
        campaignUpdatePayload: any,
        updateCampaignService: any;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

    context('#execute', () => {
        context('When a campaign is updated', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignUpdatePayload = {
                    title: 'New title',
                    description: 'New description text',
                };

                campaignUpdated = {
                    ...campaign,
                    ...campaignUpdatePayload,
                };

                updateCampaignService = {
                    update: sinon.spy(() => campaignUpdated),
                    save: sinon.spy(() => campaignUpdated),
                };

                updateCampaignOperation = new UpdateCampaignOperation({
                    updateCampaignService,
                    socketIO,
                    logger,
                });
            });

            it('should call correct methods and return correct data', async () => {
                const campaignUpdateTest = await updateCampaignOperation.execute(campaignUpdatePayload);
                expect(campaignUpdateTest).to.be.deep.equal(campaignUpdated);
                expect(updateCampaignService.update).to.have.been.calledWith(campaignUpdatePayload);
                expect(updateCampaignService.save).to.have.been.calledWith(campaignUpdated);
            });
        });

        context('When a campaign updated fails', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignUpdatePayload = {
                    title: 123,
                    description: 'New description text',
                };

                campaignUpdated = {
                    ...campaign,
                    ...campaignUpdatePayload,
                };

                updateCampaignService = {
                    update: sinon.spy(() => {
                        throw new Error('error throw');
                    }),
                    save: sinon.spy(() => campaignUpdated),
                };

                updateCampaignOperation = new UpdateCampaignOperation({
                    updateCampaignService,
                    socketIO,
                    logger,
                });
            });

            it('should call correct methods and return correct data', async () => {
                try {
                    await updateCampaignOperation.execute(campaignUpdatePayload);
                    expect('it should not be here').to.be(false);
                } catch (error: any) {
                    expect(error.message).to.be.equal('error throw');
                }
            });
        });

        it('should emit a null nextSessionResume when the saved campaign has no match data', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.matchData = null as any;

            updateCampaignService = {
                update: sinon.stub().resolves(campaign),
                save: sinon.stub().resolves(campaign),
            };

            const isolatedSocketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

            updateCampaignOperation = new UpdateCampaignOperation({
                updateCampaignService,
                socketIO: isolatedSocketIO,
                logger,
            });

            await updateCampaignOperation.execute({
                campaignId: campaign.campaignId,
            } as any);

            expect(isolatedSocketIO.emitToCampaign).to.have.been.calledWith(
                campaign.campaignId,
                'campaign:settings_updated',
                sinon.match.has('nextSessionResume', null)
            );
        });

        it('should emit the saved nextSessionResume when it exists', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.matchData.nextSessionResume = 'Session recap' as any;

            updateCampaignService = {
                update: sinon.stub().resolves(campaign),
                save: sinon.stub().resolves(campaign),
            };

            const isolatedSocketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

            updateCampaignOperation = new UpdateCampaignOperation({
                updateCampaignService,
                socketIO: isolatedSocketIO,
                logger,
            });

            await updateCampaignOperation.execute({
                campaignId: campaign.campaignId,
            } as any);

            expect(isolatedSocketIO.emitToCampaign).to.have.been.calledWith(
                campaign.campaignId,
                'campaign:settings_updated',
                sinon.match.has('nextSessionResume', 'Session recap')
            );
        });
    });
});
