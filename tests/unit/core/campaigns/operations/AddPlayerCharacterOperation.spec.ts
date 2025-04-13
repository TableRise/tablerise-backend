import sinon from 'sinon';
import AddPlayerCharacterOperation from 'src/core/campaigns/operations/AddPlayerCharacterOperation';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Operations :: AddPlayerCharacterOperation', () => {
    let addPlayerCharacterOperation: AddPlayerCharacterOperation,
        addPlayerCharacterService: any,
        playerCharacterPayload: any,
        campaign: CampaignInstance;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a character is binded to a player in a campaign', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                const userId = newUUID();

                playerCharacterPayload = {
                    campaignId: campaign.campaignId,
                    characterId: newUUID(),
                    userId,
                };

                campaign.campaignPlayers = [
                    {
                        userId,
                        characterIds: [],
                        role: 'player',
                        status: 'active',
                    },
                ];

                addPlayerCharacterService = {
                    addCharacter: sinon.spy(() => campaign),
                    save: sinon.spy(() => campaign),
                };

                addPlayerCharacterOperation = new AddPlayerCharacterOperation({
                    addPlayerCharacterService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await addPlayerCharacterOperation.execute(playerCharacterPayload);
                expect(addPlayerCharacterService.addCharacter).to.have.been.called();
                expect(addPlayerCharacterService.save).to.have.been.called();
            });
        });
    });
});
