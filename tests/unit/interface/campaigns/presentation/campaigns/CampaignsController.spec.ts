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
        getAllCampaignsOperation: any,
        postInvitationEmailOperation: any,
        updateCampaignImagesOperation: any,
        updateCampaignPlayerLimitOperation: any,
        removeCampaignImageOperation: any,
        deleteCampaignOperation: any;

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
                updateCampaignPlayerLimitOperation,
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
                mapImages: [],
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });

        it('should correctly call the methods and functions with files', async () => {
            request.body = { title: 'The new era' };
            request.user = { userId } as Express.User;
            request.files = {
                cover: [{ fieldname: 'cover' } as Express.Multer.File],
                mapImages: [{ fieldname: 'mapImages' } as Express.Multer.File],
            };
            await campaignsController.create(request, response);

            expect(createCampaignOperation.execute).to.have.been.calledWith({
                campaign: request.body,
                userId,
                image: { fieldname: 'cover' },
                mapImages: [{ fieldname: 'mapImages' }],
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });

    context('#deleteCampaign', () => {
        const request = {} as Request;
        const response = {} as Response;
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            deleteCampaignOperation = { execute: sinon.spy(() => ({ campaignId: '123', status: 'closed' })) };
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
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };

            campaignsController = new CampaignsController({
                deleteCampaignOperation,
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
                updateCampaignPlayerLimitOperation,
            });
        });

        it('should call delete campaign operation and return no content', async () => {
            request.params = { id: '123' };
            request.user = { userId } as Express.User;

            await campaignsController.deleteCampaign(request, response);

            expect(deleteCampaignOperation.execute).to.have.been.calledWith('123', userId);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.calledWith({ campaignId: '123', status: 'closed' });
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
                updateCampaignPlayerLimitOperation,
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
                updateCampaignPlayerLimitOperation,
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.query = {};
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.user = { userId: '456' } as Express.User;
            request.body = {
                title: 'Some new title',
                content: 'Some new content',
            };
            await campaignsController.publishment(request, response);

            expect(publishmentOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId: '456',
                payload: request.body,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });

    context('#inviteEmail', () => {
        const request = {} as Request;
        const response = {} as Response;

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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { campaignId: '123', targetEmail: 'test20@email.com' };

            await campaignsController.inviteEmail(request, response);

            expect(postInvitationEmailOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                targetEmail: request.query.targetEmail,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.json).to.have.not.been.called();
            expect(response.end).to.have.been.called();
        });
    });

    context('#addMatchMapImages', () => {
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.files = { mapImages: [{} as Express.Multer.File] };

            await campaignsController.addMatchMapImages(request, response);

            expect(updateMatchMapImagesOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                mapImages: request.files.mapImages,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#addMatchMusic', () => {
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
            updateMatchMusicsOperation = {
                add: sinon.spy(() => ({})),
                remove: sinon.spy(() => ({})),
                edit: sinon.spy(() => ({})),
            };
            updateMatchDateOperation = { add: () => {}, remove: () => {} };
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.body = {
                title: 'Main Theme',
                thumbnail: 'https://i.ytimg.com/vi/123/default.jpg',
                id: 'https://youtu.be/123',
            };

            await campaignsController.addMatchMusic(request, response);

            expect(updateMatchMusicsOperation.add).to.have.been.calledWith({
                campaignId: request.params.id,
                title: 'Main Theme',
                thumbnail: 'https://i.ytimg.com/vi/123/default.jpg',
                id: 'https://youtu.be/123',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#removeMatchMusic', () => {
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
            updateMatchMusicsOperation = {
                add: sinon.spy(() => ({})),
                remove: sinon.spy(() => ({})),
                edit: sinon.spy(() => ({})),
            };
            updateMatchDateOperation = { add: () => {}, remove: () => {} };
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.body = { id: 'https://youtu.be/123' };

            await campaignsController.removeMatchMusic(request, response);

            expect(updateMatchMusicsOperation.remove).to.have.been.calledWith({
                campaignId: request.params.id,
                id: 'https://youtu.be/123',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#editMatchMusic', () => {
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
            updateMatchMusicsOperation = {
                add: sinon.spy(() => ({})),
                remove: sinon.spy(() => ({})),
                edit: sinon.spy(() => ({})),
            };
            updateMatchDateOperation = { add: () => {}, remove: () => {} };
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.body = {
                title: 'Edited Theme',
                thumbnail: 'https://i.ytimg.com/vi/edited/default.jpg',
                id: 'https://youtu.be/123',
            };

            await campaignsController.editMatchMusic(request, response);

            expect(updateMatchMusicsOperation.edit).to.have.been.calledWith({
                campaignId: request.params.id,
                title: 'Edited Theme',
                thumbnail: 'https://i.ytimg.com/vi/edited/default.jpg',
                id: 'https://youtu.be/123',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#addMatchDate', () => {
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
            updateMatchMusicsOperation = { add: () => {}, remove: () => {}, edit: () => {} };
            updateMatchDateOperation = { add: sinon.spy(() => ({})), remove: sinon.spy(() => ({})) };
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { date: '20240404' };

            await campaignsController.addMatchDate(request, response);

            expect(updateMatchDateOperation.add).to.have.been.calledWith({
                campaignId: request.params.id,
                date: '20240404',
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#removeMatchDate', () => {
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
            updateMatchMusicsOperation = { add: () => {}, remove: () => {}, edit: () => {} };
            updateMatchDateOperation = { add: sinon.spy(() => ({})), remove: sinon.spy(() => ({})) };
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };

            await campaignsController.removeMatchDate(request, response);

            expect(updateMatchDateOperation.remove).to.have.been.calledWith({
                campaignId: request.params.id,
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
                updateCampaignPlayerLimitOperation,
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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { characterId: '321' };

            await campaignsController.addPlayerCharacter(request, response);

            expect(addPlayerCharacterOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
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
                updateCampaignPlayerLimitOperation,
                getAllCampaignsOperation,
                postInvitationEmailOperation,
                updateCampaignImagesOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.user = { userId } as Express.User;
            request.query = {};

            await campaignsController.removeCampaignPlayers(request, response);

            expect(removeCampaignPlayersOperation.execute).to.have.been.calledWith({
                campaignId: request.params.id,
                userId,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#removeMatchMapImage', () => {
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
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { add: () => {}, remove: () => {}, edit: () => {} };
            updateMatchDateOperation = { add: () => {}, remove: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: sinon.spy(() => ({})) };
            removeCampaignImageOperation = {
                removeMatchMapImage: sinon.spy(() => ({})),
                removeCover: sinon.spy(() => ({})),
            };

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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
                removeCampaignImageOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { imageUrl: 'https://img.bb/map.png' };

            await campaignsController.removeMatchMapImage(request, response);

            expect(removeCampaignImageOperation.removeMatchMapImage).to.have.been.calledWith({
                campaignId: request.params.id,
                imageUrl: request.query.imageUrl,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.end).to.have.been.called();
        });
    });

    context('#removeCampaignCover', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.send = sinon.spy(() => response);

            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            updateMatchMusicsOperation = { add: () => {}, remove: () => {}, edit: () => {} };
            updateMatchDateOperation = { add: () => {}, remove: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: sinon.spy(() => ({})) };
            removeCampaignImageOperation = {
                removeMatchMapImage: sinon.spy(() => ({})),
                removeCover: sinon.spy(() => ({})),
            };

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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
                removeCampaignImageOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };

            await campaignsController.removeCampaignCover(request, response);

            expect(removeCampaignImageOperation.removeCover).to.have.been.calledWith(request.params.id);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.send).to.have.been.called();
        });
    });

    context('#updateCampaignPlayerLimit', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.end = sinon.spy(() => response);

            updateCampaignPlayerLimitOperation = { execute: sinon.spy() };
            createCampaignOperation = { execute: () => {} };
            getCampaignByIdOperation = { execute: () => {} };
            updateMatchMapImagesOperation = { execute: () => {} };
            publishmentOperation = { execute: () => {} };
            updateMatchMusicsOperation = { execute: () => {} };
            updateMatchDateOperation = { execute: () => {} };
            getAllCampaignsOperation = { execute: () => {} };
            postInvitationEmailOperation = { execute: () => {} };
            updateCampaignImagesOperation = { execute: () => {} };
            updateCampaignOperation = { execute: () => {} };
            addCampaignPlayersOperation = { execute: () => {} };
            getCampaignsByUserIdOperation = { execute: () => {} };
            removeCampaignPlayersOperation = { execute: () => {} };
            addPlayerCharacterOperation = { execute: () => {} };

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
                updateCampaignPlayerLimitOperation,
                addPlayerCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { newLimit: '5' };

            await campaignsController.updateCampaignPlayerLimit(request, response);

            expect(updateCampaignPlayerLimitOperation.execute).to.have.been.calledWith('123', 5);
            expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
            expect(response.end).to.have.been.called();
        });
    });
});
