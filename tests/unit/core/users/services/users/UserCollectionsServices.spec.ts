import sinon from 'sinon';
import MessagesService from 'src/core/users/services/users/MessagesService';
import GalleryService from 'src/core/users/services/users/GalleryService';
import FriendsService from 'src/core/users/services/users/FriendsService';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Core :: Users :: Services :: Users :: UserCollectionsServices', () => {
    const logger = (): void => {};
    const encryptedMessagePayload = {
        encryptedTitle: 'encrypted-title:auth-tag-title',
        encryptedContent: 'encrypted-content:auth-tag-content',
        nonce: 'bm9uY2U=',
        keyVersion: 1,
        algorithm: 'aes-256-gcm',
    };
    const decryptedMessagePayload = {
        title: 'Hello',
        content: 'How are you?',
    };

    context('MessagesService', () => {
        it('should create a message for an active friend target', async () => {
            const senderDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            const targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            senderDetails.userId = 'sender-1';
            targetDetails.userId = 'target-1';
            senderDetails.friends = [
                {
                    userId: 'target-1',
                    nickname: 'target',
                    tag: '#1000',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                },
            ];

            const usersDetailsRepository = {
                findOne: sinon.stub().onFirstCall().resolves(senderDetails).onSecondCall().resolves(targetDetails),
                update: sinon.stub().resolves(targetDetails),
            };
            const messageCrypto = {
                encrypt: sinon.stub().returns(encryptedMessagePayload),
                decrypt: sinon.stub(),
            };

            const service = new MessagesService({
                usersDetailsRepository,
                messageCrypto,
                logger,
            } as any);

            const message = await service.create({
                senderId: 'sender-1',
                targetUserId: 'target-1',
                title: 'Hello',
                content: 'How are you?',
            });

            expect(message.userId).to.equal('sender-1');
            expect(message.status).to.equal('not-read');
            expect(targetDetails.messages.at(-1)).to.include({
                userId: 'sender-1',
                status: 'not-read',
                encryptedTitle: encryptedMessagePayload.encryptedTitle,
                encryptedContent: encryptedMessagePayload.encryptedContent,
                nonce: encryptedMessagePayload.nonce,
                keyVersion: 1,
                algorithm: 'aes-256-gcm',
            });
            expect(targetDetails.messages.at(-1)).to.not.have.property('title');
            expect(targetDetails.messages.at(-1)).to.not.have.property('content');
            expect(usersDetailsRepository.update).to.have.been.calledOnce();
            expect(messageCrypto.encrypt).to.have.been.calledWith({
                title: 'Hello',
                content: 'How are you?',
            });
        });

        it('should reject messages for non-active friends', async () => {
            const senderDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            const targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            senderDetails.friends = [
                {
                    userId: 'target-1',
                    nickname: 'target',
                    tag: '#1000',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                },
            ];

            const service = new MessagesService({
                usersDetailsRepository: {
                    findOne: sinon.stub().onFirstCall().resolves(senderDetails).onSecondCall().resolves(targetDetails),
                    update: sinon.stub(),
                },
                messageCrypto: {
                    encrypt: sinon.stub(),
                    decrypt: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.create({
                    senderId: 'sender-1',
                    targetUserId: 'target-1',
                    title: 'Hello',
                    content: 'How are you?',
                });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.FORBIDDEN);
            }
        });

        it('should mark one stored message as read', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.messages = [
                {
                    messageId: 'msg-1',
                    ...encryptedMessagePayload,
                    userId: 'sender-1',
                    timestamp: new Date().toISOString(),
                    status: 'not-read',
                },
            ];
            const usersDetailsRepository = {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            };

            const service = new MessagesService({
                usersDetailsRepository,
                messageCrypto: {
                    encrypt: sinon.stub(),
                    decrypt: sinon.stub(),
                },
                logger,
            } as any);

            await service.markAsRead({ userId: userDetails.userId, messageId: 'msg-1' });

            expect(userDetails.messages[0].status).to.equal('read');
            expect(usersDetailsRepository.update).to.have.been.calledOnce();
        });

        it('should reject when trying to mark an inexistent message as read', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.messages = [];
            const service = new MessagesService({
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                messageCrypto: {
                    encrypt: sinon.stub(),
                    decrypt: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.markAsRead({ userId: userDetails.userId, messageId: 'missing' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Message does not exist');
            }
        });

        it('should list, find, and delete stored messages', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.messages = [
                {
                    messageId: 'msg-1',
                    ...encryptedMessagePayload,
                    userId: 'sender-1',
                    timestamp: new Date().toISOString(),
                    status: 'not-read',
                },
            ];
            const usersDetailsRepository = {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            };
            const messageCrypto = {
                encrypt: sinon.stub(),
                decrypt: sinon.stub().returns(decryptedMessagePayload),
            };
            const service = new MessagesService({
                usersDetailsRepository,
                messageCrypto,
                logger,
            } as any);

            expect(await service.getAll(userDetails.userId)).to.deep.equal([
                {
                    messageId: 'msg-1',
                    ...decryptedMessagePayload,
                    userId: 'sender-1',
                    timestamp: userDetails.messages[0].timestamp,
                    status: 'not-read',
                },
            ]);
            expect(await service.getById({ userId: userDetails.userId, messageId: 'msg-1' })).to.deep.equal({
                messageId: 'msg-1',
                ...decryptedMessagePayload,
                userId: 'sender-1',
                timestamp: userDetails.messages[0].timestamp,
                status: 'not-read',
            });

            await service.remove({ userId: userDetails.userId, messageId: 'msg-1' });

            expect(userDetails.messages).to.have.lengthOf(0);
            expect(usersDetailsRepository.update).to.have.been.calledOnce();
            expect(messageCrypto.decrypt).to.have.been.calledTwice();
        });

        it('should reject when one stored message does not exist for lookup or delete', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.messages = [];
            const service = new MessagesService({
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                messageCrypto: {
                    encrypt: sinon.stub(),
                    decrypt: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.getById({ userId: userDetails.userId, messageId: 'missing' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Message does not exist');
            }

            try {
                await service.remove({ userId: userDetails.userId, messageId: 'missing' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Message does not exist');
            }
        });
    });

    context('GalleryService', () => {
        it('should find and delete one gallery image', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.gallery = [
                {
                    id: 'img-1',
                    title: '',
                    link: 'https://img.bb/1',
                    uploadDate: new Date().toISOString(),
                    deleteUrl: '',
                    request: { success: true, status: 200 },
                },
            ];

            const usersDetailsRepository = {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            };

            const service = new GalleryService({
                usersDetailsRepository,
                logger,
            } as any);

            expect((await service.getById({ userId: userDetails.userId, imageId: 'img-1' })).id).to.equal('img-1');
            await service.remove({ userId: userDetails.userId, imageId: 'img-1' });
            expect(userDetails.gallery).to.have.lengthOf(0);
        });

        it('should list all gallery images', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.gallery = [
                {
                    id: 'img-1',
                    title: '',
                    link: 'https://img.bb/1',
                    uploadDate: new Date().toISOString(),
                    deleteUrl: '',
                    request: { success: true, status: 200 },
                },
            ];

            const service = new GalleryService({
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            expect(await service.getAll(userDetails.userId)).to.deep.equal(userDetails.gallery);
        });

        it('should reject missing gallery images for lookup and delete', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.gallery = [];
            const service = new GalleryService({
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.getById({ userId: userDetails.userId, imageId: 'missing' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Gallery image does not exist');
            }

            try {
                await service.remove({ userId: userDetails.userId, imageId: 'missing' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Gallery image does not exist');
            }
        });
    });

    context('FriendsService', () => {
        it('should create a pending friend request on the target list', async () => {
            const sender = DomainDataFaker.generateUsersJSON()[0];
            sender.userId = 'sender-1';
            sender.nickname = 'sender';
            sender.tag = '#1001';
            sender.picture = {
                id: 'pic-1',
                link: 'https://img.bb/sender',
                uploadDate: new Date().toISOString(),
                title: '',
                deleteUrl: '',
                request: { success: true, status: 200 },
            };
            const senderDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            senderDetails.userId = 'sender-1';
            const targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            targetDetails.userId = 'target-1';

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return sender;
                        return { userId: 'target-1' };
                    }),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return senderDetails;
                        return targetDetails;
                    }),
                    update: sinon.stub().resolves(targetDetails),
                },
                logger,
            } as any);

            await service.createRequest({ userId: 'sender-1', targetUserId: 'target-1' });

            expect(targetDetails.friends).to.have.lengthOf(1);
            expect(targetDetails.friends[0]).to.include({
                userId: 'sender-1',
                nickname: 'sender',
                tag: '#1001',
                status: 'pending',
                favorite: false,
            });
        });

        it('should build pending friend requests with default picture and rank fallbacks', async () => {
            const sender = DomainDataFaker.generateUsersJSON()[0];
            sender.userId = 'sender-1';
            sender.nickname = 'sender';
            sender.tag = '#1001';
            sender.picture = null as any;
            const senderDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            senderDetails.userId = 'sender-1';
            senderDetails.rank = null as any;
            const targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            targetDetails.userId = 'target-1';

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return sender;
                        return { userId: 'target-1' };
                    }),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return senderDetails;
                        return targetDetails;
                    }),
                    update: sinon.stub().resolves(targetDetails),
                },
                logger,
            } as any);

            await service.createRequest({ userId: 'sender-1', targetUserId: 'target-1' });

            expect(targetDetails.friends[0]).to.include({
                picture: '',
                rank: 'bronze',
                favorite: false,
            });
        });

        it('should reject friend requests to yourself', async () => {
            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub(),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub(),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.createRequest({ userId: 'sender-1', targetUserId: 'sender-1' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.message).to.equal('You cannot add yourself as a friend');
            }
        });

        it('should reject duplicate friend requests already pending on the target', async () => {
            const sender = DomainDataFaker.generateUsersJSON()[0];
            sender.userId = 'sender-1';
            const senderDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            senderDetails.userId = 'sender-1';
            const targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            targetDetails.userId = 'target-1';
            targetDetails.friends = [
                {
                    userId: 'sender-1',
                    nickname: 'sender',
                    tag: '#1001',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                },
            ];

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return sender;
                        return { userId: 'target-1' };
                    }),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return senderDetails;
                        return targetDetails;
                    }),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.createRequest({ userId: 'sender-1', targetUserId: 'target-1' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.CONFLICT);
                expect(err.message).to.equal('Friend request already exists');
            }
        });

        it('should reject duplicate friend requests when the sender already has an active friendship', async () => {
            const sender = DomainDataFaker.generateUsersJSON()[0];
            sender.userId = 'sender-1';
            const senderDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            senderDetails.userId = 'sender-1';
            senderDetails.friends = [
                {
                    userId: 'target-1',
                    nickname: 'target',
                    tag: '#2001',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                },
            ];
            const targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            targetDetails.userId = 'target-1';

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return sender;
                        return { userId: 'target-1' };
                    }),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'sender-1') return senderDetails;
                        return targetDetails;
                    }),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.createRequest({ userId: 'sender-1', targetUserId: 'target-1' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.CONFLICT);
                expect(err.message).to.equal('Friend request already exists');
            }
        });

        it('should list and find stored friend entries', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.friends = [
                {
                    userId: 'target-1',
                    nickname: 'target',
                    tag: '#2001',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                },
            ];

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            expect(await service.getAll(userDetails.userId)).to.deep.equal(userDetails.friends);
            expect(await service.getById({ userId: userDetails.userId, targetUserId: 'target-1' })).to.deep.equal(
                userDetails.friends[0]
            );
        });

        it('should reject when the requested friend entry does not exist', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.friends = [];

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.getById({ userId: userDetails.userId, targetUserId: 'missing' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Friend does not exist');
            }
        });

        it('should accept a pending friend request and mirror the active friendship', async () => {
            const accepter = DomainDataFaker.generateUsersJSON()[0];
            accepter.userId = 'target-1';
            accepter.nickname = 'target';
            accepter.tag = '#2001';
            accepter.picture = {
                id: 'pic-2',
                link: 'https://img.bb/target',
                uploadDate: new Date().toISOString(),
                title: '',
                deleteUrl: '',
                request: { success: true, status: 200 },
            };
            const accepterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            accepterDetails.userId = 'target-1';
            accepterDetails.friends = [
                {
                    userId: 'sender-1',
                    nickname: 'sender',
                    tag: '#1001',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                },
            ];
            const requesterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            requesterDetails.userId = 'sender-1';

            const usersDetailsRepository = {
                findOne: sinon.stub().callsFake(({ userId }) => {
                    if (userId === 'target-1') return accepterDetails;
                    return requesterDetails;
                }),
                update: sinon.stub().resolves(),
            };

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().returns(accepter),
                },
                usersDetailsRepository,
                logger,
            } as any);

            await service.answerRequest({ userId: 'target-1', targetUserId: 'sender-1', decline: false });

            expect(accepterDetails.friends[0].status).to.equal('active');
            expect(requesterDetails.friends[0]).to.include({
                userId: 'target-1',
                nickname: 'target',
                tag: '#2001',
                status: 'active',
                favorite: false,
            });
            expect(usersDetailsRepository.update).to.have.been.calledTwice();
        });

        it('should accept a pending friend request when decline is omitted', async () => {
            const accepter = DomainDataFaker.generateUsersJSON()[0];
            accepter.userId = 'target-1';
            accepter.nickname = 'target';
            accepter.tag = '#2001';
            accepter.picture = {
                id: 'pic-2',
                link: 'https://img.bb/target',
                uploadDate: new Date().toISOString(),
                title: '',
                deleteUrl: '',
                request: { success: true, status: 200 },
            };
            const accepterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            accepterDetails.userId = 'target-1';
            accepterDetails.friends = [
                {
                    userId: 'sender-1',
                    nickname: 'sender',
                    tag: '#1001',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                },
            ];
            const requesterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            requesterDetails.userId = 'sender-1';

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().returns(accepter),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'target-1') return accepterDetails;
                        return requesterDetails;
                    }),
                    update: sinon.stub().resolves(),
                },
                logger,
            } as any);

            await service.answerRequest({ userId: 'target-1', targetUserId: 'sender-1' } as any);

            expect(accepterDetails.friends[0].status).to.equal('active');
            expect(requesterDetails.friends[0].status).to.equal('active');
            expect(requesterDetails.friends[0].favorite).to.equal(false);
        });

        it('should update an existing mirrored friend entry instead of pushing a new one', async () => {
            const accepter = DomainDataFaker.generateUsersJSON()[0];
            accepter.userId = 'target-1';
            accepter.nickname = 'target';
            accepter.tag = '#2001';
            accepter.picture = {
                id: 'pic-2',
                link: 'https://img.bb/target',
                uploadDate: new Date().toISOString(),
                title: '',
                deleteUrl: '',
                request: { success: true, status: 200 },
            };
            const accepterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            accepterDetails.userId = 'target-1';
            accepterDetails.friends = [
                {
                    userId: 'sender-1',
                    nickname: 'sender',
                    tag: '#1001',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                },
            ];
            const requesterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            requesterDetails.userId = 'sender-1';
            requesterDetails.friends = [
                {
                    userId: 'target-1',
                    nickname: 'old-target',
                    tag: '#9999',
                    picture: '',
                    rank: 'silver',
                    status: 'pending',
                },
            ];

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().returns(accepter),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'target-1') return accepterDetails;
                        return requesterDetails;
                    }),
                    update: sinon.stub().resolves(),
                },
                logger,
            } as any);

            await service.answerRequest({ userId: 'target-1', targetUserId: 'sender-1', decline: false });

            expect(requesterDetails.friends).to.have.lengthOf(1);
            expect(requesterDetails.friends[0]).to.include({
                nickname: 'target',
                tag: '#2001',
                status: 'active',
                favorite: false,
            });
        });

        it('should decline and remove one pending friend request', async () => {
            const accepterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            accepterDetails.userId = 'target-1';
            accepterDetails.friends = [
                {
                    userId: 'sender-1',
                    nickname: 'sender',
                    tag: '#1001',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                },
            ];
            const requesterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            requesterDetails.userId = 'sender-1';
            const usersDetailsRepository = {
                findOne: sinon.stub().callsFake(({ userId }) => {
                    if (userId === 'target-1') return accepterDetails;
                    return requesterDetails;
                }),
                update: sinon.stub().resolves(),
            };

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().returns({ userId: 'target-1' }),
                },
                usersDetailsRepository,
                logger,
            } as any);

            await service.answerRequest({ userId: 'target-1', targetUserId: 'sender-1', decline: true });

            expect(accepterDetails.friends).to.have.lengthOf(0);
            expect(usersDetailsRepository.update).to.have.been.calledOnce();
        });

        it('should reject when one friend request does not exist during answer', async () => {
            const accepterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            accepterDetails.userId = 'target-1';
            accepterDetails.friends = [];
            const requesterDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            requesterDetails.userId = 'sender-1';

            const service = new FriendsService({
                usersRepository: {
                    findOne: sinon.stub().returns({ userId: 'target-1' }),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(({ userId }) => {
                        if (userId === 'target-1') return accepterDetails;
                        return requesterDetails;
                    }),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.answerRequest({ userId: 'target-1', targetUserId: 'sender-1', decline: false });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Friend request does not exist');
            }
        });

        it('should remove an active friendship from both sides', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            const targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            targetDetails.userId = 'user-2';
            userDetails.friends = [
                {
                    userId: 'user-2',
                    nickname: 'user-2',
                    tag: '#2222',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                },
            ];
            targetDetails.friends = [
                {
                    userId: 'user-1',
                    nickname: 'user-1',
                    tag: '#1111',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                },
            ];

            const usersDetailsRepository = {
                findOne: sinon.stub().callsFake(({ userId }) => (userId === 'user-1' ? userDetails : targetDetails)),
                update: sinon.stub().resolves(),
            };

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository,
                logger,
            } as any);

            await service.remove({ userId: 'user-1', targetUserId: 'user-2' });

            expect(userDetails.friends).to.have.lengthOf(0);
            expect(targetDetails.friends).to.have.lengthOf(0);
        });

        it('should remove a pending friendship only from the owner list', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            userDetails.friends = [
                {
                    userId: 'user-2',
                    nickname: 'user-2',
                    tag: '#2222',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                },
            ];
            const usersDetailsRepository = {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(),
            };

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository,
                logger,
            } as any);

            await service.remove({ userId: 'user-1', targetUserId: 'user-2' });

            expect(userDetails.friends).to.have.lengthOf(0);
            expect(usersDetailsRepository.findOne).to.have.been.calledOnce();
            expect(usersDetailsRepository.update).to.have.been.calledOnce();
        });

        it('should toggle one active friend favorite flag from false to true and back', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            userDetails.friends = [
                {
                    userId: 'user-2',
                    nickname: 'user-2',
                    tag: '#2222',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                    favorite: false,
                },
            ];
            const usersDetailsRepository = {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(),
            };

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository,
                logger,
            } as any);

            await service.toggleFavorite({ userId: 'user-1', targetUserId: 'user-2' });
            expect(userDetails.friends[0].favorite).to.equal(true);

            await service.toggleFavorite({ userId: 'user-1', targetUserId: 'user-2' });
            expect(userDetails.friends[0].favorite).to.equal(false);
            expect(usersDetailsRepository.update).to.have.been.calledTwice();
        });

        it('should reject favorite toggles for missing friend entries', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            userDetails.friends = [];

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.toggleFavorite({ userId: 'user-1', targetUserId: 'user-2' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Friend does not exist');
            }
        });

        it('should reject favorite toggles for pending friend entries', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            userDetails.friends = [
                {
                    userId: 'user-2',
                    nickname: 'user-2',
                    tag: '#2222',
                    picture: '',
                    rank: 'bronze',
                    status: 'pending',
                    favorite: false,
                },
            ];

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.toggleFavorite({ userId: 'user-1', targetUserId: 'user-2' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.FORBIDDEN);
                expect(err.message).to.equal('Only active friends can be favorited');
            }
        });

        it('should reject when trying to remove one missing friendship', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            userDetails.friends = [];

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            try {
                await service.remove({ userId: 'user-1', targetUserId: 'user-2' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
                expect(err.message).to.equal('Friend does not exist');
            }
        });

        it('should ignore one missing mirrored active friend when removing', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            userDetails.friends = [
                {
                    userId: 'user-2',
                    nickname: 'user-2',
                    tag: '#2222',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                },
            ];
            const usersDetailsRepository = {
                findOne: sinon
                    .stub()
                    .onFirstCall()
                    .resolves(userDetails)
                    .onSecondCall()
                    .throws(
                        new HttpRequestErrors({
                            message: 'User does not exist',
                            code: HttpStatusCode.NOT_FOUND,
                            name: 'NotFound',
                        })
                    ),
                update: sinon.stub().resolves(),
            };

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository,
                logger,
            } as any);

            await service.remove({ userId: 'user-1', targetUserId: 'user-2' });

            expect(userDetails.friends).to.have.lengthOf(0);
            expect(usersDetailsRepository.update).to.have.been.calledOnce();
        });

        it('should rethrow unexpected mirrored friend removal errors', async () => {
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = 'user-1';
            userDetails.friends = [
                {
                    userId: 'user-2',
                    nickname: 'user-2',
                    tag: '#2222',
                    picture: '',
                    rank: 'bronze',
                    status: 'active',
                },
            ];
            const usersDetailsRepository = {
                findOne: sinon
                    .stub()
                    .onFirstCall()
                    .resolves(userDetails)
                    .onSecondCall()
                    .throws(new Error('unexpected failure')),
                update: sinon.stub().resolves(),
            };

            const service = new FriendsService({
                usersRepository: {},
                usersDetailsRepository,
                logger,
            } as any);

            try {
                await service.remove({ userId: 'user-1', targetUserId: 'user-2' });
                expect('it should not be here').to.equal(false);
            } catch (error) {
                expect((error as Error).message).to.equal('unexpected failure');
            }
        });
    });
});
