import { Request, Response } from 'express';
import sinon from 'sinon';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsBuysController', () => {
    it('should map the buy payload and return the updated campaign', async () => {
        const result = {
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
        const postCampaignBuyOperation = { execute: sinon.stub().resolves(result) };
        const controller = new CampaignsController({
            createCampaignOperation: { execute: sinon.stub() },
            getCampaignsByUserIdOperation: { execute: sinon.stub() },
            updateCampaignOperation: { execute: sinon.stub() },
            getCampaignByIdOperation: { execute: sinon.stub() },
            publishmentOperation: { execute: sinon.stub() },
            getAllCampaignsOperation: { execute: sinon.stub() },
            updateMatchMusicsOperation: { execute: sinon.stub() },
            updateMatchMapImagesOperation: { execute: sinon.stub() },
            updateMatchDateOperation: { execute: sinon.stub() },
            addCampaignPlayersOperation: { execute: sinon.stub() },
            removeCampaignPlayersOperation: { execute: sinon.stub() },
            addPlayerCharacterOperation: { execute: sinon.stub() },
            removePlayerCharacterOperation: { execute: sinon.stub() },
            getCampaignCharactersOperation: { execute: sinon.stub() },
            getCharactersByPlayerOperation: { execute: sinon.stub() },
            postInvitationEmailOperation: { execute: sinon.stub() },
            postCampaignLogOperation: { execute: sinon.stub() },
            postCampaignBuyOperation,
            updateCampaignPlayerLimitOperation: { execute: sinon.stub() },
            confirmMatchPlayerPresenceOperation: { execute: sinon.stub() },
            confirmCampaignPlayerOperation: { execute: sinon.stub() },
            updateCampaignCoverOperation: { execute: sinon.stub() },
            removeCampaignImageOperation: { execute: sinon.stub() },
            transferDungeonMasterOperation: { execute: sinon.stub() },
            updateMatchCharacterPictureOperation: { execute: sinon.stub() },
            updateCampaignJournalHighlightOperation: { execute: sinon.stub() },
            updateCampaignJournalPostOperation: { execute: sinon.stub() },
            deleteCampaignJournalPostOperation: { execute: sinon.stub() },
            deleteCampaignOperation: { execute: sinon.stub() },
        } as any);
        const request = {
            params: { id: 'campaign-id' },
            user: { userId: 'caller-user' },
            body: {
                name: 'Potion',
                cost: '10 gp',
                character: 'Lia',
                user: 'buyer-user',
                date: '2026-05-16',
            },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await controller.postCampaignBuy(request, response);

        expect(postCampaignBuyOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-id',
            userId: 'caller-user',
            payload: request.body,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
        expect(response.json).to.have.been.calledWith(result);
    });
});
