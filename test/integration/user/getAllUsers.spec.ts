import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import EmailSender from 'src/services/user/helpers/EmailSender';
// import JWTGenerator from 'src/services/authentication/helpers/JWTGenerator';
import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
// import AuthorizationMiddleware from 'src/middlewares/AuthorizationMiddleware';

describe('Post user in database', () => {
    const userInstanceMock = mock.user.user;
    const userInstanceMock2 = { ...mock.user.user };
    const userDetailsInstanceMock = mock.user.userDetails;
    const userDetailsInstanceMock2 = { ...mock.user.userDetails };

    userInstanceMock.email = `${Math.random()}${userInstanceMock.email}`;
    userInstanceMock2.email = `${Math.random()}${userInstanceMock.email}`;

    const { providerId: _, createdAt: _1, updatedAt: _2, tag: _4, ...userInstanceMockPayload } = userInstanceMock;
    const { providerId: _0, createdAt: _3, updatedAt: _7, tag: _8, ...userInstanceMockPayload2 } = userInstanceMock2;
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;
    const { userId: _6, ...userDetailsInstanceMockPayload2 } = userDetailsInstanceMock2;

    const userPayload = {
        ...userInstanceMockPayload,
        twoFactorSecret: { active: true },
        details: userDetailsInstanceMockPayload,
    };

    const userPayload2 = {
        ...userInstanceMockPayload2,
        twoFactorSecret: { active: true },
        details: { ...userDetailsInstanceMockPayload2, role: 'admin' },
    };

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When delete a user', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: 'XRFS78' });
        });

        afterAll(() => {
            jest.clearAllMocks();
        });
        it('should return correct status', async () => {
            const userResponse1 = await requester()
                .post('/profile/register')
                .send(userPayload)
                .expect(HttpStatusCode.CREATED);

            const userResponse2 = await requester()
                .post('/profile/register')
                .send(userPayload2)
                .expect(HttpStatusCode.CREATED);

            const userId1: string = userResponse1.body._id;
            const userId2: string = userResponse2.body._id;

            await requester().patch(`/profile/${userId2}/confirm?code=XRFS78`).expect(HttpStatusCode.OK);

            const loginPayload = {
                email: userPayload2.email,
                password: userPayload2.password,
            };

            const loginResponse = await requester().post('/profile/login').send(loginPayload).expect(HttpStatusCode.OK);

            const token: string = loginResponse.body.token;

            const response = await requester()
                .get(`/profile/all`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatusCode.OK);

            const user1 = response.body.find((res: { _id: string }) => res._id === userId1);
            const user2 = response.body.find((res: { _id: string }) => res._id === userId2);

            expect(response.status).toBe(200);
            expect(user1).not.toBe(undefined);
            expect(user2).not.toBe(undefined);
        });
    });
});
