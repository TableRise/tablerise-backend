import sinon from 'sinon';
import PostCampaignBuyOperation from 'src/core/campaigns/operations/PostCampaignBuyOperation';

describe('Core :: Campaigns :: Operations :: PostCampaignBuyOperation', () => {
    it('should return the saved campaign from the service without side effects', async () => {
        const savedCampaign = {
            campaignId: 'campaign-id',
            buys: [
                {
                    name: 'Potion',
                    cost: '10 gp',
                    character: 'Lia',
                    user: 'buyer-user',
                    date: '2026-05-16',
                },
            ],
        };
        const postCampaignBuyService = {
            createBuy: sinon.stub().resolves(savedCampaign),
        };
        const operation = new PostCampaignBuyOperation({
            postCampaignBuyService: postCampaignBuyService as any,
            logger: (): void => {},
        } as any);
        const payload = {
            campaignId: 'campaign-id',
            userId: 'caller-user',
            payload: {
                name: 'Potion',
                cost: '10 gp',
                character: 'Lia',
                user: 'buyer-user',
                date: '2026-05-16',
            },
        };

        const result = await operation.execute(payload);

        expect(postCampaignBuyService.createBuy).to.have.been.calledWith(payload);
        expect(result).to.deep.equal(savedCampaign);
    });
});
