import newUUID from 'src/domains/common/helpers/newUUID';
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignsController from 'src/interface/campaigns/presentation/campaigns/CampaignsController';

describe('Interface :: Campaigns :: Presentation :: Campaigns :: CampaignsController', () => {
    let campaignsController: CampaignsController,
        createCampaignOperation: any,
        publishPostOperation: any,
        updateMatchMapImagesOperation: any,
        updateMatchMusicsOperation: any,
        updateCampaignOperation: any,
        updateMatchDatesOperation: any,
        getCampaignByIdOperation: any,
        updateMatchPlayersOperation: any,
        getAllCampaignsOperation: any,
        postInvitationEmailOperation: any;

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
            publishPostOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDatesOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
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
            publishPostOperation = { execute: () => {} };
            updateCampaignOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateMatchDatesOperation,
                updateMatchMusicsOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation
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
            updateMatchDatesOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
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

    context('#getAll', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMapImagesOperation = { execute: () => {} };
            publishPostOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDatesOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: sinon.spy(() => ({})) };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                publishPostOperation,
                updateMatchMapImagesOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                updateCampaignOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await campaignsController.getAll(request, response);

            expect(getAllCampaignsOperation.execute).to.have.been.called();
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#publishPost', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            publishPostOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDatesOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                getCampaignByIdOperation,
                getAllCampaignsOperation,
                updateMatchPlayersOperation,
                postInvitationEmailOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { userId: '456' };
            request.body = {
                title: 'Some new title',
                content: 'Some new content',
            };
            await campaignsController.publishPost(request, response);

            expect(publishPostOperation.execute).to.have.been.calledWith({
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
            publishPostOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDatesOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: sinon.spy(() => ({})) };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                getCampaignByIdOperation,
                getAllCampaignsOperation,
                updateMatchPlayersOperation,
                postInvitationEmailOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { targetEmail: 'test20@email.com' }
            request.user = { userId, username } as Express.User;

            await campaignsController.inviteEmail(request, response);

            expect(postInvitationEmailOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId: userId,
                username: username,
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
            publishPostOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: sinon.spy(() => ({})) };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDatesOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
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
            publishPostOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: sinon.spy(() => ({})) };
            updateMatchDatesOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
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

    context('#updateMatchDates', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishPostOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDatesOperation = { execute: sinon.spy(() => ({})) };
            updateMatchPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                updateMatchMapImagesOperation,
                publishPostOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                updateCampaignOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { operation: 'add', date: '20240404' };

            await campaignsController.updateMatchDates(request, response);

            expect(updateMatchDatesOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                date: '20240404',
                operation: 'add',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#updateMatchPlayers', () => {
        const request = {} as Request;
        const response = {} as Response;
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishPostOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDatesOperation = { execute: () => {} };
            updateMatchPlayersOperation = { execute: sinon.spy(() => ({})) };
            postInvitationEmailOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                createCampaignOperation,
                publishPostOperation,
                updateMatchMapImagesOperation,
                updateCampaignOperation,
                updateMatchMusicsOperation,
                updateMatchDatesOperation,
                getCampaignByIdOperation,
                updateMatchPlayersOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { operation: 'add' };
            request.user = { userId } as Express.User;

            await campaignsController.updateMatchPlayers(request, response);

            expect(updateMatchPlayersOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId,
                operation: 'add',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
