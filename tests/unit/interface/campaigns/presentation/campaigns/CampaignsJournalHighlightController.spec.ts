import { Request, Response } from 'express';
import sinon from 'sinon';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsJournalHighlightController', () => {
    const buildController = ({
        getCampaignByIdOperation = { execute: sinon.stub().resolves({ infos: { highlightedJournal: {} } }) },
        updateCampaignJournalHighlightOperation = { execute: sinon.stub().resolves({}) },
    }: any = {}): CampaignsController =>
        new CampaignsController({
            createCampaignOperation: { execute: sinon.stub() },
            getCampaignsByUserIdOperation: { execute: sinon.stub() },
            updateCampaignOperation: { execute: sinon.stub() },
            getCampaignByIdOperation,
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
            postBanPlayerOperation: { execute: sinon.stub() },
            updateCampaignPlayerLimitOperation: { execute: sinon.stub() },
            confirmMatchPlayerPresenceOperation: { execute: sinon.stub() },
            confirmCampaignPlayerOperation: { execute: sinon.stub() },
            updateCampaignCoverOperation: { execute: sinon.stub() },
            removeCampaignImageOperation: { execute: sinon.stub() },
            transferDungeonMasterOperation: { execute: sinon.stub() },
            updateMatchCharacterPictureOperation: { execute: sinon.stub() },
            updateCampaignJournalHighlightOperation,
        } as any);

    context('#getCampaignJournalHighlight', () => {
        it('should return the highlighted journal post', async () => {
            const highlightedJournal = { title: 'Pinned note' };
            const getCampaignByIdOperation = { execute: sinon.stub().resolves({ infos: { highlightedJournal } }) };
            const controller = buildController({ getCampaignByIdOperation });
            const request = { params: { id: 'campaign-id' } } as unknown as Request;
            const response = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub().returnsThis(),
            } as unknown as Response;

            await controller.getCampaignJournalHighlight(request, response);

            expect(getCampaignByIdOperation.execute).to.have.been.calledWith({ campaignId: 'campaign-id' });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.calledWith(highlightedJournal);
        });
    });

    context('#updateCampaignJournalHighlight', () => {
        it('should forward the payload and return the updated highlight', async () => {
            const request = {
                params: { id: 'campaign-id' },
                user: { userId: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                body: {
                    toggle: 'on',
                    post: {
                        title: 'Pinned note',
                    },
                },
            } as unknown as Request;
            const response = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub().returnsThis(),
            } as unknown as Response;
            const highlightedJournal = { title: 'Pinned note' };
            const updateCampaignJournalHighlightOperation = { execute: sinon.stub().resolves(highlightedJournal) };
            const controller = buildController({ updateCampaignJournalHighlightOperation });

            await controller.updateCampaignJournalHighlight(request, response);

            expect(updateCampaignJournalHighlightOperation.execute).to.have.been.calledWith({
                campaignId: 'campaign-id',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                ...request.body,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.calledWith(highlightedJournal);
        });
    });
});
