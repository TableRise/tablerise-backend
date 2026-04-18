import sinon from 'sinon';
import UpdateCampaignPlayerLimitService from 'src/core/campaigns/services/UpdateCampaignPlayerLimitService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: UpdateCampaignPlayerLimitService', () => {
    let updateCampaignPlayerLimitService: UpdateCampaignPlayerLimitService,
        campaignsRepository: any,
        campaign: Campaign;

    const logger = (): void => {};

    context('#updatePlayerLimit', () => {
        context('When campaign player limit is updated with success', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];

                campaignsRepository = {
                    findOne: sinon.spy(() => ({ ...campaign, infos: { ...campaign.infos } })),
                    update: sinon.spy(),
                };

                updateCampaignPlayerLimitService = new UpdateCampaignPlayerLimitService({
                    logger,
                    campaignsRepository,
                });
            });

            it('should call the correct methods', async () => {
                const campaignId = campaign.campaignId as string;
                const newLimit = 4;

                await updateCampaignPlayerLimitService.updatePlayerLimit(campaignId, newLimit);

                expect(campaignsRepository.findOne).to.have.been.calledWith({ campaignId });
                expect(campaignsRepository.update).to.have.been.called();

                const updateCall = (campaignsRepository.update as sinon.SinonSpy).getCall(0);
                expect(updateCall.args[0].payload.infos.playerAmountLimit).to.be.equal(newLimit);
            });
        });
    });
});
