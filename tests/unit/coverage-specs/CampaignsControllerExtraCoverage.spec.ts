import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';

describe('Coverage :: CampaignsController :: Extra Methods', () => {
    const buildController = (overrides: Record<string, any> = {}): CampaignsController =>
        new CampaignsController({
            createCampaignOperation: { execute: sinon.stub() },
            getCampaignByIdOperation: {
                execute: sinon.stub().resolves({ campaignPlayers: [], infos: { journal: [] } }),
            },
            getCampaignsByUserIdOperation: { execute: sinon.stub() },
            deleteCampaignOperation: { execute: sinon.stub() },
            updateCampaignOperation: { execute: sinon.stub() },
            publishmentOperation: { execute: sinon.stub() },
            getAllCampaignsOperation: { execute: sinon.stub() },
            updateMatchMusicsOperation: { add: sinon.stub(), remove: sinon.stub(), edit: sinon.stub() },
            updateMatchMapImagesOperation: { execute: sinon.stub() },
            updateMatchImagesOperation: { execute: sinon.stub() },
            updateMatchHighlightedImageOperation: { execute: sinon.stub() },
            addCampaignPlayersOperation: { execute: sinon.stub() },
            removeCampaignPlayersOperation: { execute: sinon.stub() },
            addPlayerCharacterOperation: { execute: sinon.stub() },
            removePlayerCharacterOperation: { execute: sinon.stub() },
            getCampaignCharactersOperation: { execute: sinon.stub() },
            getCharactersByPlayerOperation: { execute: sinon.stub() },
            postInvitationEmailOperation: { execute: sinon.stub() },
            postCampaignBuyOperation: { execute: sinon.stub() },
            confirmMatchPlayerPresenceOperation: { execute: sinon.stub() },
            confirmCampaignPlayerOperation: { execute: sinon.stub() },
            updateCampaignCoverOperation: { execute: sinon.stub() },
            removeCampaignImageOperation: { removeCover: sinon.stub(), removeMatchMapImage: sinon.stub() },
            transferDungeonMasterOperation: { execute: sinon.stub() },
            updateCampaignJournalHighlightOperation: { execute: sinon.stub() },
            updateCampaignJournalPostOperation: { execute: sinon.stub() },
            deleteCampaignJournalPostOperation: { execute: sinon.stub() },
            updateCampaignPlayerNoteOperation: { execute: sinon.stub() },
            removeCampaignPlayerNoteOperation: { execute: sinon.stub() },
            ...overrides,
        } as any);

    const buildResponse = (): Response =>
        ({
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
            end: sinon.stub().returnsThis(),
            send: sinon.stub().returnsThis(),
        }) as unknown as Response;

    it('should cover player and journal getter methods', async () => {
        const getCampaignByIdOperation = {
            execute: sinon.stub().resolves({
                campaignPlayers: [{ userId: 'player-1' }],
                infos: {
                    journal: [{ postId: 'post-1' }],
                    highlightedJournal: { postId: 'highlight-1' },
                },
            }),
        };
        const getCampaignCharactersOperation = { execute: sinon.stub().resolves([{ characterId: 'char-1' }]) };
        const getCharactersByPlayerOperation = { execute: sinon.stub().resolves([{ characterId: 'char-2' }]) };
        const controller = buildController({
            getCampaignByIdOperation,
            getCampaignCharactersOperation,
            getCharactersByPlayerOperation,
        });

        const getCharactersReq = { params: { id: 'campaign-1' } } as unknown as Request;
        const getCharactersRes = buildResponse();
        await controller.getCampaignCharacters(getCharactersReq, getCharactersRes);
        expect(getCampaignCharactersOperation.execute).to.have.been.calledWith('campaign-1');
        expect(getCharactersRes.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(getCharactersRes.json).to.have.been.calledWith([{ characterId: 'char-1' }]);

        const getCharactersByPlayerReq = {
            params: { id: 'campaign-1' },
            user: { userId: 'player-1' },
        } as unknown as Request;
        const getCharactersByPlayerRes = buildResponse();
        await controller.getCharactersByPlayer(getCharactersByPlayerReq, getCharactersByPlayerRes);
        expect(getCharactersByPlayerOperation.execute).to.have.been.calledWith('campaign-1', 'player-1');
        expect(getCharactersByPlayerRes.json).to.have.been.calledWith([{ characterId: 'char-2' }]);

        const getPlayersReq = { params: { id: 'campaign-1' } } as unknown as Request;
        const getPlayersRes = buildResponse();
        await controller.getCampaignPlayers(getPlayersReq, getPlayersRes);
        expect(getPlayersRes.json).to.have.been.calledWith([{ userId: 'player-1' }]);

        const getJournalReq = { params: { id: 'campaign-1' } } as unknown as Request;
        const getJournalRes = buildResponse();
        await controller.getCampaignJournalPosts(getJournalReq, getJournalRes);
        expect(getJournalRes.json).to.have.been.calledWith([{ postId: 'post-1' }]);

        const getHighlightReq = { params: { id: 'campaign-1' } } as unknown as Request;
        const getHighlightRes = buildResponse();
        await controller.getCampaignJournalHighlight(getHighlightReq, getHighlightRes);
        expect(getHighlightRes.json).to.have.been.calledWith({ postId: 'highlight-1' });
    });

    it('should cover empty highlighted journal fallback', async () => {
        const controller = buildController({
            getCampaignByIdOperation: {
                execute: sinon.stub().resolves({
                    campaignPlayers: [],
                    infos: { journal: [], highlightedJournal: null },
                }),
            },
        });
        const req = { params: { id: 'campaign-1' } } as unknown as Request;
        const res = buildResponse();

        await controller.getCampaignJournalHighlight(req, res);

        expect(res.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(res.json).to.have.been.calledWith({});
    });

    it('should cover confirmation and transfer no-content handlers', async () => {
        const confirmMatchPlayerPresenceOperation = { execute: sinon.stub().resolves() };
        const confirmCampaignPlayerOperation = { execute: sinon.stub().resolves() };
        const transferDungeonMasterOperation = { execute: sinon.stub().resolves() };
        const controller = buildController({
            confirmMatchPlayerPresenceOperation,
            confirmCampaignPlayerOperation,
            transferDungeonMasterOperation,
        });

        const confirmPresenceReq = {
            params: { id: 'campaign-1' },
            user: { userId: 'player-1' },
            query: { cancel: true },
        } as unknown as Request;
        const confirmPresenceRes = buildResponse();
        await controller.confirmPlayerPresence(confirmPresenceReq, confirmPresenceRes);
        expect(confirmMatchPlayerPresenceOperation.execute).to.have.been.calledWith('campaign-1', 'player-1', true);
        expect(confirmPresenceRes.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(confirmPresenceRes.end).to.have.been.called();

        const confirmPlayerReq = {
            params: { id: 'campaign-1' },
            user: { userId: 'dm-1' },
            query: { userToActivate: 'player-1' },
        } as unknown as Request;
        const confirmPlayerRes = buildResponse();
        await controller.confirmCampaignPlayer(confirmPlayerReq, confirmPlayerRes);
        expect(confirmCampaignPlayerOperation.execute).to.have.been.calledWith('campaign-1', 'dm-1', 'player-1');
        expect(confirmPlayerRes.end).to.have.been.called();

        const transferReq = {
            params: { id: 'campaign-1' },
            user: { userId: 'dm-1' },
            query: { userToMaster: 'player-1' },
        } as unknown as Request;
        const transferRes = buildResponse();
        await controller.transferDungeonMaster(transferReq, transferRes);
        expect(transferDungeonMasterOperation.execute).to.have.been.calledWith('campaign-1', 'dm-1', 'player-1');
        expect(transferRes.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
    });

    it('should cover the campaign cover upload handler', async () => {
        const updateCampaignCoverOperation = { execute: sinon.stub().resolves({ id: 'cover-1' }) };
        const controller = buildController({
            updateCampaignCoverOperation,
        });

        const coverReq = {
            params: { id: 'campaign-1' },
            file: { originalname: 'cover.png' },
        } as unknown as Request;
        const coverRes = buildResponse();
        await controller.updateCampaignCover(coverReq, coverRes);
        expect(updateCampaignCoverOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            picture: { originalname: 'cover.png' },
        });
        expect(coverRes.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(coverRes.json).to.have.been.calledWith({ id: 'cover-1' });
    });

    it('should cover removePlayerCharacter handler', async () => {
        const removePlayerCharacterOperation = { execute: sinon.stub().resolves({ campaignId: 'campaign-1' }) };
        const controller = buildController({
            removePlayerCharacterOperation,
        });

        const req = {
            params: { id: 'campaign-1' },
            query: { characterId: 'char-1' },
        } as unknown as Request;
        const res = buildResponse();

        await controller.removePlayerCharacter(req, res);

        expect(removePlayerCharacterOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            characterId: 'char-1',
        });
        expect(res.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(res.json).to.have.been.calledWith({ campaignId: 'campaign-1' });
    });

    it('should cover addCampaignPlayers and removeCampaignPlayers override query branches', async () => {
        const addCampaignPlayersOperation = { execute: sinon.stub().resolves({ campaignId: 'campaign-1' }) };
        const removeCampaignPlayersOperation = { execute: sinon.stub().resolves({ campaignId: 'campaign-1' }) };
        const controller = buildController({
            addCampaignPlayersOperation,
            removeCampaignPlayersOperation,
        });

        const addReq = {
            params: { id: 'campaign-1' },
            query: { password: 'secret', userToAdd: 'player-2' },
            user: { userId: 'caller-1' },
        } as unknown as Request;
        const addRes = buildResponse();
        await controller.addCampaignPlayers(addReq, addRes);
        expect(addCampaignPlayersOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            userId: 'player-2',
            password: 'secret',
        });

        const removeReq = {
            params: { id: 'campaign-1' },
            query: { userToRemove: 'player-2' },
            user: { userId: 'caller-1' },
        } as unknown as Request;
        const removeRes = buildResponse();
        await controller.removeCampaignPlayers(removeReq, removeRes);
        expect(removeCampaignPlayersOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            userId: 'player-2',
        });
    });

    it('should cover addMatchMapImages without uploaded files', async () => {
        const updateMatchMapImagesOperation = { execute: sinon.stub().resolves(['map']) };
        const controller = buildController({
            updateMatchMapImagesOperation,
        });

        const req = {
            params: { id: 'campaign-1' },
        } as unknown as Request;
        const res = buildResponse();

        await controller.addMatchMapImages(req, res);

        expect(updateMatchMapImagesOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            mapImages: undefined,
        });
        expect(res.json).to.have.been.calledWith(['map']);
    });

    it('should cover addMatchImages without uploaded files', async () => {
        const updateMatchImagesOperation = { execute: sinon.stub().resolves(['image']) };
        const controller = buildController({
            updateMatchImagesOperation,
        });

        const req = {
            params: { id: 'campaign-1' },
        } as unknown as Request;
        const res = buildResponse();

        await controller.addMatchImages(req, res);

        expect(updateMatchImagesOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            images: undefined,
        });
        expect(res.json).to.have.been.calledWith(['image']);
    });
});
