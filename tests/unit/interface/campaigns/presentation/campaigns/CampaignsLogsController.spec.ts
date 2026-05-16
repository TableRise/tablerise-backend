import { Request, Response } from 'express';
import sinon from 'sinon';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsLogsController', () => {
    it('should map the log payload and return the updated campaign', async () => {
        const result = { campaignId: 'campaign-id', matchData: { logs: [{ loggedAt: 'now', content: 'created' }] } };
        const postCampaignLogOperation = { execute: sinon.stub().resolves(result) };
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
            postCampaignLogOperation,
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
            user: { userId: 'user-id' },
            body: { loggedAt: '2026-05-13T12:00:00.000Z', content: 'A new log entry' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await controller.postCampaignLog(request, response);

        expect(postCampaignLogOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-id',
            userId: 'user-id',
            payload: request.body,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
        expect(response.json).to.have.been.calledWith(result);
    });
});
