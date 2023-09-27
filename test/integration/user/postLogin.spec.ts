import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

describe('Post login', () => {
    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;

    userInstanceMock.email = `${Math.random()}${userInstanceMock.email}`;

    const { providerId: _, createdAt: _1, updatedAt: _2, tag: _4, ...userInstanceMockPayload } = userInstanceMock;
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;

    const userPayload = {
        ...userInstanceMockPayload,
        details: userDetailsInstanceMockPayload,
    };

    beforeAll(async () => {
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
        it.only('should return a token', async () => {
            await requester.post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);

            const loginPayload = {
                email: userPayload.email,
                password: userPayload.password,
            };

            const response = await requester.post('/profile/login').send(loginPayload).expect(HttpStatusCode.OK);

            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });
    });
});
