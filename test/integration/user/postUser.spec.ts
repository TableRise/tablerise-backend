import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

describe('Post user in database', () => {
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

    describe('When register a new user', () => {
        it('should return correct data and status', async () => {
            const response = await requester.post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);

            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('tag');
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).toHaveProperty('updatedAt');
            expect(response.body).toHaveProperty('details');
            expect(response.body).toHaveProperty('password');
            expect(response.body.details).toHaveProperty('userId');
            expect(response.body.email).toBe(userPayload.email);
            expect(response.body.nickname).toBe(userPayload.nickname);
        });
    });
});
