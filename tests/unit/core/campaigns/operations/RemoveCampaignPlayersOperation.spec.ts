import sinon from 'sinon';
import RemoveCampaignPlayersOperation from 'src/core/campaigns/operations/RemoveCampaignPlayersOperation';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: RemoveCampaignPlayersOperation', () => {
    let removeCampaignPlayersOperation: RemoveCampaignPlayersOperation,
        removeCampaignPlayersService: any,
        matchPlayersPayload: any,
        campaign: Campaign;

    const logger = (): void => {};
    const socketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

    context('#execute', () => {
        context('When a campaign has the match players', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                const userId = newUUID();

                matchPlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId,
                };

                campaign.campaignPlayers = [
                    {
                        userId,
                        characterIds: [],
                        role: 'player',
                        status: 'pending',
                    },
                ];

                removeCampaignPlayersService = {
                    removeCampaignPlayers: sinon.spy(() => ({
                        campaign,
                        userDetails: {},
                    })),
                    save: sinon.spy(() => campaign),
                };

                removeCampaignPlayersOperation = new RemoveCampaignPlayersOperation({
                    removeCampaignPlayersService,
                    socketIO,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const removePlayerTest = await removeCampaignPlayersOperation.execute(matchPlayersPayload);

                expect(removeCampaignPlayersService.removeCampaignPlayers).to.have.been.called();
                expect(removeCampaignPlayersService.save).to.have.been.called();
                expect(removePlayerTest[0]).to.have.property('userId');
                expect(removePlayerTest[0].userId).to.be.equal(matchPlayersPayload.userId);
                expect(removePlayerTest[0]).to.have.property('characterIds');
                expect(removePlayerTest[0].characterIds.length).to.be.equal(0);
                expect(removePlayerTest[0]).to.have.property('role');
                expect(removePlayerTest[0].role).to.be.equal('player');
                expect(removePlayerTest[0]).to.have.property('status');
                expect(removePlayerTest[0].status).to.be.equal('pending');
            });
        });
    });
});
