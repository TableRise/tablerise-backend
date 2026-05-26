import sinon from 'sinon';
import AddCampaignPlayersOperation from 'src/core/campaigns/operations/AddCampaignPlayersOperation';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: AddCampaignPlayersOperation', () => {
    let addCampaignPlayersOperation: AddCampaignPlayersOperation,
        addCampaignPlayersService: any,
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
                    characterId: newUUID(),
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

                addCampaignPlayersService = {
                    addCampaignPlayers: sinon.spy(() => ({
                        campaign,
                        userDetails: {},
                    })),
                    save: sinon.spy(() => campaign),
                };

                addCampaignPlayersOperation = new AddCampaignPlayersOperation({
                    addCampaignPlayersService,
                    socketIO,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const addPlayerTest = await addCampaignPlayersOperation.execute(matchPlayersPayload);

                expect(addCampaignPlayersService.addCampaignPlayers).to.have.been.called();
                expect(addCampaignPlayersService.save).to.have.been.called();
                expect(addPlayerTest[0]).to.have.property('userId');
                expect(addPlayerTest[0].userId).to.be.equal(matchPlayersPayload.userId);
                expect(addPlayerTest[0]).to.have.property('characterIds');
                expect(addPlayerTest[0].characterIds.length).to.be.equal(0);
                expect(addPlayerTest[0]).to.have.property('role');
                expect(addPlayerTest[0].role).to.be.equal('player');
                expect(addPlayerTest[0]).to.have.property('status');
                expect(addPlayerTest[0].status).to.be.equal('pending');
            });
        });
    });

    it('should not emit player_joined when the saved player cannot be found', async () => {
        campaign = DomainDataFaker.generateCampaignsJSON()[0];
        matchPlayersPayload = {
            campaignId: campaign.campaignId,
            characterId: newUUID(),
            userId: 'missing-user',
        };

        addCampaignPlayersService = {
            addCampaignPlayers: sinon.spy(() => ({
                campaign,
                userDetails: {},
            })),
            save: sinon.spy(() => ({
                ...campaign,
                campaignPlayers: [],
            })),
        };

        const isolatedSocketIO = { emitToCampaign: sinon.spy(), syncActiveCampaign: sinon.spy() } as any;

        addCampaignPlayersOperation = new AddCampaignPlayersOperation({
            addCampaignPlayersService,
            socketIO: isolatedSocketIO,
            logger,
        });

        await addCampaignPlayersOperation.execute(matchPlayersPayload);

        expect(isolatedSocketIO.syncActiveCampaign).to.have.been.calledOnce;
        expect(isolatedSocketIO.emitToCampaign).not.to.have.been.called;
    });
});
