import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import RemovePlayerCharacterOperation from 'src/core/campaigns/operations/RemovePlayerCharacterOperation';

describe('Core :: Campaigns :: Operations :: RemovePlayerCharacterOperation', () => {
    let removePlayerCharacterOperation: RemovePlayerCharacterOperation,
        removePlayerCharacterService: any,
        playerCharacterPayload: any,
        campaign: Campaign;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a character is removed from a campaign player', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                const userId = newUUID();

                playerCharacterPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId,
                };

                removePlayerCharacterService = {
                    removeCharacter: sinon.spy(() => campaign),
                    save: sinon.spy(() => campaign),
                };

                removePlayerCharacterOperation = new RemovePlayerCharacterOperation({
                    removePlayerCharacterService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const campaignUpdated = await removePlayerCharacterOperation.execute(playerCharacterPayload);

                expect(removePlayerCharacterService.removeCharacter).to.have.been.calledWith(playerCharacterPayload);
                expect(removePlayerCharacterService.save).to.have.been.calledWith(campaign);
                expect(campaignUpdated).to.be.deep.equal(campaign);
            });
        });
    });
});
