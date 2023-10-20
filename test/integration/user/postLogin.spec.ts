import requester from '../../support/requester';
import mock from 'src/infra/mocks/user';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import EmailSender from 'src/infra/helpers/user/EmailSender';
import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';

describe('Post login', () => {
    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;

    userInstanceMock.email = `${Math.random()}${userInstanceMock.email}`;

    const { providerId: _, createdAt: _1, updatedAt: _2, tag: _4, ...userInstanceMockPayload } = userInstanceMock;
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;

    const userPayload = {
        ...userInstanceMockPayload,
        twoFactorSecret: { active: true },
        details: userDetailsInstanceMockPayload,
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

    describe('When login', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: 'XRFS78' });
        });

        it('should return a token', async () => {
            const userResponse = await requester()
                .post('/profile/register')
                .send(userPayload)
                .expect(HttpStatusCode.CREATED);

            const userId: string = userResponse.body._id;

            await requester().patch(`/profile/${userId}/confirm?code=XRFS78`).expect(HttpStatusCode.OK);

            const loginPayload = {
                email: userPayload.email,
                password: userPayload.password,
            };

            const response = await requester().post('/profile/login').send(loginPayload).expect(HttpStatusCode.OK);

            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });
    });
});
