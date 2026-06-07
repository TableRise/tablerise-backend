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

        expect(message.title).to.equal('Hello');
        expect(message.status).to.equal('not-read');
        expect(messages).to.have.lengthOf(1);
        expect(messages[0].messageId).to.equal(message.messageId);
        expect(messages[0].status).to.equal('not-read');

        await supertest(app)
            .patch(`/users/${targetUser.userId}/messages/${message.messageId as string}/mark`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: markedMessage } = await supertest(app)
            .get(`/users/${targetUser.userId}/messages/${message.messageId as string}`)
            .set('Cookie', `token=${targetToken}`)
            .expect(HttpStatusCode.OK);

        expect(markedMessage.status).to.equal('read');
    });

    it('should populate and delete gallery items after a profile picture upload', async () => {
        await requester()
            .post(`/users/${ownerUserId}/update/picture`)
            .attach('picture', filePath)
            .expect(HttpStatusCode.OK);

        const { body: gallery } = await requester().get(`/users/${ownerUserId}/gallery`).expect(HttpStatusCode.OK);
        expect(gallery).to.have.lengthOf(1);

        await requester()
            .delete(`/users/${ownerUserId}/gallery/${gallery[0].id as string}`)
            .expect(HttpStatusCode.NO_CONTENT);

        const { body: galleryAfterDelete } = await requester()
            .get(`/users/${ownerUserId}/gallery`)
            .expect(HttpStatusCode.OK);
        expect(galleryAfterDelete).to.have.lengthOf(0);
    });

    it('should reject owner-only collection reads from another authenticated user', async () => {
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
    });
});
