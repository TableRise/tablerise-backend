import { Request, Response } from 'express';
import sinon from 'sinon';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsJournalPostsController', () => {
    const buildController = ({
        updateCampaignJournalPostOperation = { execute: sinon.stub().resolves({}) },
        deleteCampaignJournalPostOperation = { execute: sinon.stub().resolves() },
    }: any = {}): CampaignsController =>
        new CampaignsController({
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
            updateCampaignPlayerLimitOperation: { execute: sinon.stub() },
            confirmMatchPlayerPresenceOperation: { execute: sinon.stub() },
            confirmCampaignPlayerOperation: { execute: sinon.stub() },
            updateCampaignCoverOperation: { execute: sinon.stub() },
            removeCampaignImageOperation: { execute: sinon.stub() },
            transferDungeonMasterOperation: { execute: sinon.stub() },
            updateMatchCharacterPictureOperation: { execute: sinon.stub() },
            updateCampaignJournalHighlightOperation: { execute: sinon.stub() },
            updateCampaignJournalPostOperation,
            deleteCampaignJournalPostOperation,
        } as any);

    it('should map the update route payload and return the updated post', async () => {
        const request = {
            params: { id: 'campaign-id' },
            query: { userId: 'author-id' },
            user: { userId: 'author-id' },
            body: {
                postId: 'post-id',
                title: 'Updated title',
                post: 'Updated content',
                category: 'players',
            },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;
        const result = { postId: 'post-id', title: 'Updated title' };
        const updateCampaignJournalPostOperation = { execute: sinon.stub().resolves(result) };
        const controller = buildController({ updateCampaignJournalPostOperation });

        await controller.updateJournalPost(request, response);

        expect(updateCampaignJournalPostOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-id',
            callerId: 'author-id',
            userId: 'author-id',
            postId: 'post-id',
            title: 'Updated title',
            post: 'Updated content',
            category: 'players',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith(result);
    });

    it('should map the delete route payload and return no content', async () => {
        const request = {
            params: { id: 'campaign-id' },
            query: { userId: 'author-id', postId: 'post-id' },
            user: { userId: 'admin-id' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            end: sinon.stub().returnsThis(),
        } as unknown as Response;
        const deleteCampaignJournalPostOperation = { execute: sinon.stub().resolves() };
        const controller = buildController({ deleteCampaignJournalPostOperation });

        await controller.deleteJournalPost(request, response);

        expect(deleteCampaignJournalPostOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-id',
            callerId: 'admin-id',
            userId: 'author-id',
            postId: 'post-id',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });
});
