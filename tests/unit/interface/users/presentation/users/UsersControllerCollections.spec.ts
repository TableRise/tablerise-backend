import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UsersController from 'src/interface/users/presentation/users/UsersController';

describe('Interface :: Users :: Presentation :: Users :: UsersController :: Collections', () => {
    const buildResponse = (): any => ({
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
        end: sinon.stub().returnsThis(),
    });

    const buildController = () =>
        new UsersController({
            createUserOperation: { execute: sinon.stub() },
            updateUserOperation: { execute: sinon.stub() },
            updateUserDetailsOperation: { execute: sinon.stub() },
            verifyEmailOperation: { execute: sinon.stub() },
            getUsersOperation: { execute: sinon.stub() },
            getUserByIdOperation: { execute: sinon.stub() },
            activateTwoFactorOperation: { execute: sinon.stub() },
            deactivateTwoFactorOperation: { execute: sinon.stub() },
            updateEmailOperation: { execute: sinon.stub() },
            updatePasswordOperation: { execute: sinon.stub() },
            addCampaignNoteOperation: { execute: sinon.stub() },
            pictureProfileOperation: { execute: sinon.stub() },
            postSupportEmailOperation: { execute: sinon.stub() },
            registerDonationOperation: { execute: sinon.stub() },
            updateUserCoverOperation: { execute: sinon.stub() },
            removeUserCoverOperation: { execute: sinon.stub() },
            deleteUserOperation: { execute: sinon.stub() },
            logoutUserOperation: { execute: sinon.stub() },
            loginUserOperation: { execute: sinon.stub() },
            getCampaignsByUserIdOperation: { execute: sinon.stub() },
            messagesOperation: {
                create: sinon.stub().resolves({ messageId: 'msg-1' }),
                getAll: sinon.stub().resolves([{ messageId: 'msg-1' }]),
                getById: sinon.stub().resolves({ messageId: 'msg-1' }),
                remove: sinon.stub().resolves(),
                markAsRead: sinon.stub().resolves(),
            },
            galleryOperation: {
                getAll: sinon.stub().resolves([{ id: 'img-1' }]),
                getById: sinon.stub().resolves({ id: 'img-1' }),
                remove: sinon.stub().resolves(),
            },
            friendsOperation: {
                createRequest: sinon.stub().resolves(),
                getAll: sinon.stub().resolves([{ userId: 'friend-1' }]),
                getById: sinon.stub().resolves({ userId: 'friend-1' }),
                answerRequest: sinon.stub().resolves(),
                remove: sinon.stub().resolves(),
            },
        } as any);

    it('should create messages and list user collections', async () => {
        const controller = buildController() as any;
        const response = buildResponse();

        await controller.postMessage(
            {
                params: { id: 'user-1' },
                user: { userId: 'user-1' },
                body: { title: 'hi', content: 'there', targetUserId: 'friend-1' },
            } as any,
            response
        );
        expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);

        await controller.getMessages({ params: { id: 'user-1' }, user: { userId: 'user-1' } } as any, response);
        await controller.getGallery({ params: { id: 'user-1' }, user: { userId: 'user-1' } } as any, response);
        await controller.getFriends({ params: { id: 'user-1' }, user: { userId: 'user-1' } } as any, response);

        expect(controller.messagesOperation.getAll).to.have.been.calledWith('user-1');
        expect(controller.galleryOperation.getAll).to.have.been.calledWith('user-1');
        expect(controller.friendsOperation.getAll).to.have.been.calledWith('user-1');
    });

    it('should pass lookup and mutation payloads for nested collections', async () => {
        const controller = buildController() as any;
        const response = buildResponse();

        await controller.getMessageById(
            { params: { id: 'user-1', messageId: 'msg-1' }, user: { userId: 'user-1' } } as any,
            response
        );
        await controller.deleteMessage(
            { params: { id: 'user-1', messageId: 'msg-1' }, user: { userId: 'user-1' } } as any,
            response
        );
        await controller.getGalleryImage(
            { params: { id: 'user-1', imageId: 'img-1' }, user: { userId: 'user-1' } } as any,
            response
        );
        await controller.deleteGalleryImage(
            { params: { id: 'user-1', imageId: 'img-1' }, user: { userId: 'user-1' } } as any,
            response
        );
        await controller.postFriendRequest(
            {
                params: { id: 'user-1', targetUserId: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                user: { userId: 'user-1' },
            } as any,
            response
        );
        await controller.acceptFriendRequest(
            {
                params: { id: 'user-1', targetUserId: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                query: {},
                user: { userId: 'user-1' },
            } as any,
            response
        );
        await controller.getFriendById(
            {
                params: { id: 'user-1', targetUserId: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                user: { userId: 'user-1' },
            } as any,
            response
        );
        await controller.removeFriend(
            {
                params: { id: 'user-1', targetUserId: '12cd093b-0a8a-42fe-910f-001f2ab28454' },
                user: { userId: 'user-1' },
            } as any,
            response
        );
        await controller.markMessageAsRead(
            { params: { id: 'user-1', messageId: 'msg-1' }, user: { userId: 'user-1' } } as any,
            response
        );

        expect(controller.messagesOperation.getById).to.have.been.calledWith({ userId: 'user-1', messageId: 'msg-1' });
        expect(controller.messagesOperation.remove).to.have.been.calledWith({ userId: 'user-1', messageId: 'msg-1' });
        expect(controller.galleryOperation.getById).to.have.been.calledWith({ userId: 'user-1', imageId: 'img-1' });
        expect(controller.galleryOperation.remove).to.have.been.calledWith({ userId: 'user-1', imageId: 'img-1' });
        expect(controller.messagesOperation.markAsRead).to.have.been.calledWith({
            userId: 'user-1',
            messageId: 'msg-1',
        });
        expect(controller.friendsOperation.createRequest).to.have.been.calledOnce();
        expect(controller.friendsOperation.getById).to.have.been.calledWith({
            userId: 'user-1',
            targetUserId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
        });
        expect(controller.friendsOperation.answerRequest).to.have.been.calledWith({
            userId: 'user-1',
            targetUserId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            decline: false,
        });
        expect(controller.friendsOperation.remove).to.have.been.calledWith({
            userId: 'user-1',
            targetUserId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
        });
    });

    it('should reject owner-only nested collection access', async () => {
        const controller = buildController();
        const response = buildResponse();

        try {
            await controller.getGallery({ params: { id: 'user-1' }, user: { userId: 'user-2' } } as any, response);
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.code).to.equal(HttpStatusCode.UNAUTHORIZED);
        }
    });

    it('should reject friend lookups with an invalid target user id', async () => {
        const controller = buildController();
        const response = buildResponse();

        try {
            await controller.getFriendById(
                { params: { id: 'user-1', targetUserId: 'invalid-id' }, user: { userId: 'user-1' } } as any,
                response
            );
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
            expect(err.message).to.equal('The parameter targetUserId is invalid');
        }
    });
});
