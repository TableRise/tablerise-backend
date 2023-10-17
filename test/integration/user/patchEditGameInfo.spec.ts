import speakeasy from 'speakeasy';
import logger from '@tablerise/dynamic-logger';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import requester from '../../support/requester';
import EmailSender from 'src/services/user/helpers/EmailSender';
import JWTGenerator from 'src/services/authentication/helpers/JWTGenerator';

describe('Add user badges', () => {
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
        requester.set('Authorization', 'Bearer test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request to add user badge', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: 'XRFS78' });
            jest.spyOn(JWTGenerator, 'verify').mockReturnValue(true);
            jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct status', async () => {
            const userResponse = await requester
                .post('/profile/register')
                .send(userPayload)
                .expect(HttpStatusCode.CREATED);

            const userId: string = userResponse.body._id;
            const infoId = generateNewMongoID();

            await requester
                .patch(`/profile/${userId}/update/game-info?id=${infoId}&info=badges&operation=add`)
                .expect(HttpStatusCode.OK);
        });
    });
});
