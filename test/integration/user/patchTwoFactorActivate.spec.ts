import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import getToken from '../../support/getToken';

describe('Patch two factor activate in database', () => {
    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;

    userInstanceMock.email = `${Math.random()}${userInstanceMock.email}`;

    const { providerId: _, createdAt: _1, updatedAt: _2, tag: _4, ...userInstanceMockPayload } = userInstanceMock;
    const { userId: _5, ...userDetailsInstanceMockPayload } = userDetailsInstanceMock;

    const userPayload = {
        ...userInstanceMockPayload,
        twoFactorSecret: { active: false },
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

    describe('When 2FA is turned to active true', () => {
        it('should return correct data and status', async () => {
            const userResponse = await requester
                .post('/profile/register')
                .send(userPayload);

            // eslint-disable-next-line no-console
            console.log(userResponse);

            const userToken = await getToken(userPayload);

            const userId: string = userResponse.body._id;

            const response = await requester
                .patch(`/profile/${userId}/2fa/activate`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(HttpStatusCode.OK);

            expect(response.body).toHaveProperty('qrcode');
            expect(response.body).toHaveProperty('active');
            expect(response.body.active).toBe(true);
        });
    });
});
