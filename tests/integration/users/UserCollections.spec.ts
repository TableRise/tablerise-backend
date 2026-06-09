import path from 'path';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import DatabaseManagement from '@tablerise/database-management';
import { container } from 'src/container';
import requester from 'tests/support/requester';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('Users collections routes', () => {
    const ownerUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const ownerDetailId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
    const usersModel = new DatabaseManagement().modelInstance('user', 'Users');
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');
    const filePath = path.resolve(__dirname, '../../support/assets/test-image-batman.jpeg');
    let targetUser: User;
    let targetDetails: UserDetail;

    async function resetOwnerDetails(): Promise<void> {
        const ownerDetails = await userDetailsModel.findOne({ userDetailId: ownerDetailId });
        ownerDetails.messages = [];
        ownerDetails.gallery = [];
        ownerDetails.friends = [];

        await userDetailsModel.update({ userDetailId: ownerDetailId }, ownerDetails);
    }

    beforeEach(async () => {
        targetUser = DomainDataFaker.generateUsersJSON()[0];
        targetUser.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusWas: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };
        targetUser.picture = {
            id: '',
            link: '',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        targetDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        targetDetails.messages = [];
        targetDetails.gallery = [];
        targetDetails.friends = [];

        await resetOwnerDetails();
        await InjectNewUser(targetUser);
        await InjectNewUserDetails(targetDetails, targetUser.userId);
    });

    afterEach(async () => {
        await usersModel.delete({ userId: targetUser.userId });
        await userDetailsModel.delete({ userId: targetUser.userId });
        await resetOwnerDetails();
    });

    it('should complete the friend request, accept, and message flow', async () => {
        await requester().post(`/users/${ownerUserId}/friends/${targetUser.userId}`).expect(HttpStatusCode.NO_CONTENT);

        const app = container.resolve('application').setupExpress();
        const targetToken = jwt.sign(
            {
                userId: targetUser.userId,
                providerId: null,
                username: 'target-user',
            },
            'secret'
        );

        await supertest(app)
            .patch(`/users/${targetUser.userId}/friends/accept/${ownerUserId}`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: message } = await requester()
            .post(`/users/${ownerUserId}/message`)
            .send({
                title: 'Hello',
                content: 'Welcome friend',
                targetUserId: targetUser.userId,
            })
            .expect(HttpStatusCode.CREATED);

        const { body: messages } = await supertest(app)
            .get(`/users/${targetUser.userId}/messages`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.OK);
        const storedTargetDetails = await userDetailsModel.findOne({ userId: targetUser.userId });
        const storedMessage = storedTargetDetails.messages[0];

        expect(message.title).to.equal('Hello');
        expect(message.content).to.equal('Welcome friend');
        expect(message.status).to.equal('not-read');
        expect(messages).to.have.lengthOf(1);
        expect(messages[0].messageId).to.equal(message.messageId);
        expect(messages[0].title).to.equal('Hello');
        expect(messages[0].content).to.equal('Welcome friend');
        expect(messages[0].status).to.equal('not-read');
        expect(storedMessage.encryptedTitle).to.be.a('string');
        expect(storedMessage.encryptedContent).to.be.a('string');
        expect(storedMessage.encryptedTitle).to.not.equal('Hello');
        expect(storedMessage.encryptedContent).to.not.equal('Welcome friend');
        expect(storedMessage.nonce).to.be.a('string');
        expect(storedMessage.keyVersion).to.equal(1);
        expect(storedMessage.algorithm).to.equal('aes-256-gcm');
        expect(storedMessage.title).to.equal(undefined);
        expect(storedMessage.content).to.equal(undefined);

        await supertest(app)
            .patch(`/users/${targetUser.userId}/messages/${message.messageId as string}/mark`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: markedMessage } = await supertest(app)
            .get(`/users/${targetUser.userId}/messages/${message.messageId as string}`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.OK);

        expect(markedMessage.title).to.equal('Hello');
        expect(markedMessage.content).to.equal('Welcome friend');
        expect(markedMessage.status).to.equal('read');
    });

    it('should populate and delete gallery items after a profile picture upload', async () => {
        await requester()
            .post(`/users/${ownerUserId}/update/picture`)
            .attach('picture', filePath)
            .expect(HttpStatusCode.OK);

        const { body: gallery } = await requester().get(`/users/${ownerUserId}/gallery`).expect(HttpStatusCode.OK);
        expect(gallery).to.have.lengthOf(1);
        const ownerDetailsAfterUpload = await userDetailsModel.findOne({ userDetailId: ownerDetailId });
        const uploadedImageId = ownerDetailsAfterUpload.gallery[0].id as string;

        await requester().delete(`/users/${ownerUserId}/gallery/${uploadedImageId}`).expect(HttpStatusCode.NO_CONTENT);

        const { body: galleryAfterDelete } = await requester()
            .get(`/users/${ownerUserId}/gallery`)
            .expect(HttpStatusCode.OK);
        expect(galleryAfterDelete).to.have.lengthOf(0);
    });

    it('should keep gallery owner-only while allowing other users to read one user friends list', async () => {
        await requester().post(`/users/${ownerUserId}/friends/${targetUser.userId}`).expect(HttpStatusCode.NO_CONTENT);

        const app = container.resolve('application').setupExpress();
        const targetToken = jwt.sign(
            {
                userId: targetUser.userId,
                providerId: null,
                username: 'target-user',
            },
            'secret'
        );

        const { body } = await supertest(app)
            .get(`/users/${ownerUserId}/gallery`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.UNAUTHORIZED);

        expect(body.message).to.equal('Unauthorized');

        await supertest(app)
            .patch(`/users/${targetUser.userId}/friends/accept/${ownerUserId}`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: ownerFriends } = await supertest(app)
            .get(`/users/${ownerUserId}/friends`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.OK);

        expect(ownerFriends).to.have.lengthOf(1);
        expect(ownerFriends[0].userId).to.equal(targetUser.userId);
    });

    it('should toggle one active friend favorite flag for the owner only', async () => {
        await requester().post(`/users/${ownerUserId}/friends/${targetUser.userId}`).expect(HttpStatusCode.NO_CONTENT);

        const app = container.resolve('application').setupExpress();
        const targetToken = jwt.sign(
            {
                userId: targetUser.userId,
                providerId: null,
                username: 'target-user',
            },
            'secret'
        );

        await supertest(app)
            .patch(`/users/${targetUser.userId}/friends/accept/${ownerUserId}`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.NO_CONTENT);

        await requester()
            .patch(`/users/${ownerUserId}/friends/${targetUser.userId}/favorite`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: ownerFriendsAfterFavorite } = await requester()
            .get(`/users/${ownerUserId}/friends`)
            .expect(HttpStatusCode.OK);
        expect(ownerFriendsAfterFavorite[0].favorite).to.equal(true);

        await requester()
            .patch(`/users/${ownerUserId}/friends/${targetUser.userId}/favorite`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: ownerFriendsAfterUnfavorite } = await requester()
            .get(`/users/${ownerUserId}/friends`)
            .expect(HttpStatusCode.OK);
        expect(ownerFriendsAfterUnfavorite[0].favorite).to.equal(false);

        const { body: targetFriends } = await supertest(app)
            .get(`/users/${targetUser.userId}/friends`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.OK);
        expect(targetFriends[0].favorite).to.equal(false);

        await supertest(app)
            .patch(`/users/${ownerUserId}/friends/${targetUser.userId}/favorite`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.UNAUTHORIZED);
    });

    it('should reject favorite toggles for pending friend requests', async () => {
        await requester().post(`/users/${ownerUserId}/friends/${targetUser.userId}`).expect(HttpStatusCode.NO_CONTENT);

        const app = container.resolve('application').setupExpress();
        const targetToken = jwt.sign(
            {
                userId: targetUser.userId,
                providerId: null,
                username: 'target-user',
            },
            'secret'
        );

        const { body } = await supertest(app)
            .patch(`/users/${targetUser.userId}/friends/${ownerUserId}/favorite`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.FORBIDDEN);

        expect(body.message).to.equal('Only active friends can be favorited');
    });
});
