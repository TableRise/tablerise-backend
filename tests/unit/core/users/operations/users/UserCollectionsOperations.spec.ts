import sinon from 'sinon';
import MessagesOperation from 'src/core/users/operations/users/MessagesOperation';
import GalleryOperation from 'src/core/users/operations/users/GalleryOperation';
import FriendsOperation from 'src/core/users/operations/users/FriendsOperation';

describe('Core :: Users :: Operations :: Users :: UserCollectionsOperations', () => {
    const logger = (): void => {};

    it('should delegate message operations', async () => {
        const messagesService = {
            create: sinon.stub().resolves({ messageId: 'msg-1' }),
            getAll: sinon.stub().resolves([]),
            getById: sinon.stub().resolves({ messageId: 'msg-1' }),
            remove: sinon.stub().resolves(),
            markAsRead: sinon.stub().resolves(),
        };
        const operation = new MessagesOperation({ messagesService, logger } as any);

        expect(
            (await operation.create({ senderId: 'a', targetUserId: 'b', title: 't', content: 'c' })).messageId
        ).to.equal('msg-1');
        await operation.getAll('a');
        await operation.getById({ userId: 'a', messageId: 'msg-1' });
        await operation.remove({ userId: 'a', messageId: 'msg-1' });
        await operation.markAsRead({ userId: 'a', messageId: 'msg-1' });

        expect(messagesService.create).to.have.been.calledOnce();
        expect(messagesService.getAll).to.have.been.calledWith('a');
        expect(messagesService.getById).to.have.been.calledOnce();
        expect(messagesService.remove).to.have.been.calledOnce();
        expect(messagesService.markAsRead).to.have.been.calledOnce();
    });

    it('should delegate gallery operations', async () => {
        const galleryService = {
            getAll: sinon.stub().resolves([]),
            getById: sinon.stub().resolves({ id: 'img-1' }),
            remove: sinon.stub().resolves(),
        };
        const operation = new GalleryOperation({ galleryService, logger } as any);

        await operation.getAll('a');
        expect((await operation.getById({ userId: 'a', imageId: 'img-1' })).id).to.equal('img-1');
        await operation.remove({ userId: 'a', imageId: 'img-1' });
    });

    it('should delegate friends operations', async () => {
        const friendsService = {
            createRequest: sinon.stub().resolves(),
            getAll: sinon.stub().resolves([]),
            getById: sinon.stub().resolves({ userId: 'b' }),
            answerRequest: sinon.stub().resolves(),
            remove: sinon.stub().resolves(),
        };
        const operation = new FriendsOperation({ friendsService, logger } as any);

        await operation.createRequest({ userId: 'a', targetUserId: 'b' });
        await operation.getAll('a');
        expect((await operation.getById({ userId: 'a', targetUserId: 'b' })).userId).to.equal('b');
        await operation.answerRequest({ userId: 'a', targetUserId: 'b', decline: false });
        await operation.remove({ userId: 'a', targetUserId: 'b' });
    });
});
