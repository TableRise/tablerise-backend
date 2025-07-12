import newUUID from 'src/domains/common/helpers/newUUID';
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsController', () => {
    let campaignsController: CampaignsController,
        createCampaignOperation: any,
        publishmentOperation: any,
        updateMatchMapImagesOperation: any,
        updateMatchMusicsOperation: any,
        updateCampaignOperation: any,
        updateMatchDateOperation: any,
        getCampaignByIdOperation: any,
        addCampaignPlayersOperation: any,
        getCampaignsByUserIdOperation: any,
        addPlayerCharacterOperation: any,
        removeCampaignPlayersOperation: any,
        postBanPlayerOperation: any,
        getAllCampaignsOperation: any,
        postInvitationEmailOperation: any,
        updateCampaignImagesOperation: any;

    context('#create', () => {
        const request = {} as Request;
        const response = {} as Response;
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: sinon.spy(() => ({})) };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateCampaignOperation,
                addPlayerCharacterOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignsByUserIdOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.body = { title: 'The new era' };
            request.user = { userId } as Express.User;
            await campaignsController.create(request, response);

            expect(createCampaignOperation.execute).to.have.been.calledWith({
                campaign: request.body,
                userId,
                image: undefined,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });

    context('#update', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateMatchDateOperation,
                updateMatchMusicsOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.body = {
                title: 'New title',
                description: 'Some new desc',
                visibility: 'visible',
            };
            request.file = {} as Express.Multer.File;

            await campaignsController.update(request, response);

            expect(updateCampaignOperation.execute).to.have.been.calledWith({
                ...request.body,
                cover: {},
                campaignId: '123',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#getById', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await campaignsController.getById(request, response);

            expect(getCampaignByIdOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#getByUserId', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: sinon.spy(() => ({})) };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await campaignsController.getByUserId(request, response);

            expect(getCampaignsByUserIdOperation.execute).to.have.been.calledWith(request.params.id);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#getAll', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMapImagesOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: sinon.spy(() => ({})) };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                publishmentOperation,
                updateMatchMapImagesOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                updateCampaignOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await campaignsController.getAll(request, response);

            expect(getAllCampaignsOperation.execute).to.have.been.called();
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#publishment', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            publishmentOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                getAllCampaignsOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { userId: '456' };
            request.body = {
                title: 'Some new title',
                content: 'Some new content',
            };
            await campaignsController.publishment(request, response);

            expect(publishmentOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId: request.query.userId,
                payload: request.body,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });

    context('#inviteEmail', () => {
        const request = {} as Request;
        const response = {} as Response;
        const username = 'joaquim';
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: sinon.spy(() => ({})) };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                getAllCampaignsOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { targetEmail: 'test20@email.com' };
            request.user = { userId, username } as Express.User;

            await campaignsController.inviteEmail(request, response);

            expect(postInvitationEmailOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId,
                username,
                targetEmail: request.query.targetEmail,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.json).to.have.not.been.called();
            expect(response.end).to.have.been.called();
        });
    });

    context('#updateMatchMapImages', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { operation: 'add' };
            request.file = {} as Express.Multer.File;

            await campaignsController.updateMatchMapImages(request, response);

            expect(updateMatchMapImagesOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                imageId: undefined,
                operation: 'add',
                mapImage: {},
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#updateMatchMusics', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: sinon.spy(() => ({})) };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { operation: 'add' };
            request.body = { title: 'Main Theme', youtubeLink: 'https://youtu.be/123' };

            await campaignsController.updateMatchMusics(request, response);

            expect(updateMatchMusicsOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                title: 'Main Theme',
                operation: 'add',
                youtubeLink: 'https://youtu.be/123',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#updateMatchDate', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: sinon.spy(() => ({})) };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                updateCampaignOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { operation: 'add', date: '20240404' };

            await campaignsController.updateMatchDate(request, response);

            expect(updateMatchDateOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                date: '20240404',
                operation: 'add',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#addCampaignPlayers', () => {
        const request = {} as Request;
        const response = {} as Response;
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: sinon.spy(() => ({})) };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                publishmentOperation,
                updateMatchMapImagesOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { password: '1234' };
            request.user = { userId } as Express.User;

            await campaignsController.addCampaignPlayers(request, response);

            expect(addCampaignPlayersOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId,
                ...request.query,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#addPlayerCharacterOperation', () => {
        const request = {} as Request;
        const response = {} as Response;
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: sinon.spy(() => ({})) };
            addPlayerCharacterOperation = { execute: sinon.spy(() => ({})) };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                publishmentOperation,
                updateMatchMapImagesOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { characterId: '321' };
            request.user = { userId } as Express.User;

            await campaignsController.addPlayerCharacter(request, response);

            expect(addPlayerCharacterOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId,
                characterId: request.query.characterId,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });

    context('#removeCampaignPlayers', () => {
        const request = {} as Request;
        const response = {} as Response;
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: sinon.spy(() => ({})) };
            postBanPlayerOperation = { execute: sinon.spy(() => ({})) };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                publishmentOperation,
                updateMatchMapImagesOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                postBanPlayerOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.user = { userId } as Express.User;

            await campaignsController.removeCampaignPlayers(request, response);

            expect(removeCampaignPlayersOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#banPlayer', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: sinon.spy(() => ({})) };
            postBanPlayerOperation = { execute: sinon.spy(() => ({})) };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                publishmentOperation,
                updateMatchMapImagesOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                postBanPlayerOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { playerId: '321' };

            await campaignsController.banPlayer(request, response);

            expect(postBanPlayerOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                playerId: request.query.playerId,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        });
    });

    context('#updateCampaignImages', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: sinon.spy(() => ({})) };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateCampaignOperation,
                updateMatchMapImagesOperation,
                publishmentOperation,
                updateMatchMusicsOperation,
                updateMatchDateOperation,
                getCampaignByIdOperation,
                addCampaignPlayersOperation,
                getCampaignsByUserIdOperation,
                removeCampaignPlayersOperation,
                getAllCampaignsOperation,
                updateCampaignImagesOperation,
                postInvitationEmailOperation,
                postBanPlayerOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { operation: 'add' };
            request.file = {} as Express.Multer.File;

            await campaignsController.updateCampaignImages(request, response);

            expect(updateCampaignImagesOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                imageId: undefined,
                name: undefined,
                operation: 'add',
                image: {},
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
