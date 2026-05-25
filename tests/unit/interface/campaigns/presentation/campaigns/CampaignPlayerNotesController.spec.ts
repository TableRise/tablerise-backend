import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';

describe('Interface :: Campaigns :: Presentation :: Campaign Player Notes :: CampaignsController', () => {
    let updateCampaignPlayerNoteOperation: any;
    let removeCampaignPlayerNoteOperation: any;
    let controller: CampaignsController;

    const buildController = (): CampaignsController =>
        new CampaignsController({
            deleteCampaignOperation: {},
            getAllCampaignsOperation: {},
            getCampaignByIdOperation: {},
            publishmentOperation: {},
            createCampaignOperation: {},
            updateCampaignOperation: {},
            updateMatchMapImagesOperation: {},
            updateMatchImagesOperation: {},
            updateMatchHighlightedImageOperation: {},
            updateMatchMusicsOperation: {},
            updateMatchDateOperation: {},
            addCampaignPlayersOperation: {},
            removeCampaignPlayersOperation: {},
            getCampaignsByUserIdOperation: {},
            addPlayerCharacterOperation: {},
            removePlayerCharacterOperation: {},
            getCampaignCharactersOperation: {},
            getCharactersByPlayerOperation: {},
            postInvitationEmailOperation: {},
            postCampaignLogOperation: {},
            postCampaignBuyOperation: {},
            updateCampaignPlayerLimitOperation: {},
            confirmMatchPlayerPresenceOperation: {},
            confirmCampaignPlayerOperation: {},
            updateCampaignCoverOperation: {},
            removeCampaignImageOperation: {},
            transferDungeonMasterOperation: {},
            updateMatchCharacterPictureOperation: {},
            updateCampaignJournalHighlightOperation: {},
            updateCampaignJournalPostOperation: {},
            deleteCampaignJournalPostOperation: {},
            updateCampaignPlayerNoteOperation,
            removeCampaignPlayerNoteOperation,
        } as any);

    beforeEach(() => {
        updateCampaignPlayerNoteOperation = {
            execute: sinon.stub().resolves({ title: 'Session Plan', content: 'New content' }),
        };
        removeCampaignPlayerNoteOperation = { execute: sinon.stub().resolves() };
        controller = buildController();
    });

    it('should pass the authenticated user note update payload and return 200', async () => {
        const request = {
            params: { id: 'campaign-id' },
            user: { userId: 'player-id' },
            query: { title: 'Session Plan' },
            body: { content: 'New content' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await controller.updatePlayerNote(request, response);

        expect(updateCampaignPlayerNoteOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-id',
            userId: 'player-id',
            title: 'Session Plan',
            content: 'New content',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ title: 'Session Plan', content: 'New content' });
    });

    it('should pass the authenticated user note removal payload and return 204', async () => {
        const request = {
            params: { id: 'campaign-id' },
            user: { userId: 'player-id' },
            query: { title: 'Session Plan' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            end: sinon.stub().returnsThis(),
        } as unknown as Response;

        await controller.removePlayerNote(request, response);

        expect(removeCampaignPlayerNoteOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-id',
            userId: 'player-id',
            title: 'Session Plan',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });
});
