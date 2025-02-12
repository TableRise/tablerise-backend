import Sinon from 'sinon';
import RecoverCharacterByCampaignOperation from 'src/core/characters/operations/RecoverCharacterByCampaignOperation';

describe('Core :: Characters :: Operations :: RecoverCharacterByCampaignOperation', () => {
    let recoverCharacterByCampaignOperation: RecoverCharacterByCampaignOperation,
        recoverCharacterByCampaignService: any;

    const logger = (): void => {};

    context('When you recover characters by campaign', () => {
        const campaignId = '123';
        const userId = '123';

        before(() => {
            recoverCharacterByCampaignService = {
                recoverByCampaign: Sinon.spy(() => {}),
            };

            recoverCharacterByCampaignOperation = new RecoverCharacterByCampaignOperation(
                {
                    recoverCharacterByCampaignService,
                    logger,
                }
            );
        });

        it('should return correct character', async () => {
            await recoverCharacterByCampaignOperation.execute({ campaignId, userId });
            expect(
                recoverCharacterByCampaignService.recoverByCampaign
            ).to.have.been.calledWith({
                campaignId,
                userId,
            });
        });
    });
});
