import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: Match Images Controller', () => {
    const buildController = (overrides: Record<string, any> = {}): CampaignsController =>
        new CampaignsController({
            getCampaignsByUserIdOperation: {},
            deleteCampaignOperation: {},
            createCampaignOperation: {},
            updateCampaignOperation: {},
            getCampaignByIdOperation: {},
            publishmentOperation: {},
            getAllCampaignsOperation: {},
            updateMatchMusicsOperation: {},
            updateMatchMapImagesOperation: {},
            updateMatchImagesOperation: {},
            updateMatchHighlightedImageOperation: {},
            updateMatchDateOperation: {},
            addCampaignPlayersOperation: {},
            removeCampaignPlayersOperation: {},
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
            ...overrides,
        } as any);

    it('should add match images from multipart files', async () => {
        const request = {
            params: { id: 'campaign-1' },
            files: { images: [{ fieldname: 'images' }] },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;
        const updateMatchImagesOperation = { execute: sinon.stub().resolves([{ id: 'image-1' }]) };
        const controller = buildController({ updateMatchImagesOperation });

        await controller.addMatchImages(request, response);

        expect(updateMatchImagesOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            images: [{ fieldname: 'images' }],
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith([{ id: 'image-1' }]);
    });

    it('should highlight one match image by query param', async () => {
        const request = {
            params: { id: 'campaign-1' },
            query: { imageId: 'image-1' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;
        const updateMatchHighlightedImageOperation = {
            execute: sinon.stub().resolves({ id: 'image-1', link: 'https://img.bb/image-1' }),
        };
        const controller = buildController({ updateMatchHighlightedImageOperation });

        await controller.highlightMatchImage(request, response);

        expect(updateMatchHighlightedImageOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            imageId: 'image-1',
            remove: undefined,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith({ id: 'image-1', link: 'https://img.bb/image-1' });
    });

    it('should remove highlighted image by query param', async () => {
        const request = {
            params: { id: 'campaign-1' },
            query: { remove: true },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;
        const updateMatchHighlightedImageOperation = {
            execute: sinon.stub().resolves(null),
        };
        const controller = buildController({ updateMatchHighlightedImageOperation });

        await controller.highlightMatchImage(request, response);

        expect(updateMatchHighlightedImageOperation.execute).to.have.been.calledWith({
            campaignId: 'campaign-1',
            imageId: undefined,
            remove: true,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.calledWith(null);
    });
});
