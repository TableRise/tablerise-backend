import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import EmailSender from 'src/services/user/helpers/EmailSender';

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

    describe('When login', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: 'XRFS78' });
        });

        it('should return a token', async () => {
            await requester().post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);

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
