import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import EmailSender from 'src/services/user/helpers/EmailSender';
import { postUserSerializer } from 'src/services/user/helpers/userSerializer';

describe('Update an user in database', () => {
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

    const userUpdateRequest = {
        nickname: 'mock_user_update_test',
        picture: 'mock/test.png',
        details: {
            firstName: 'mock_test_update_fn',
            lastName: 'mock_test_update_ln',
        },
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

    describe('When update an user', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: 'XRFS78' });
        });
        it('should return user updated infos', async () => {
            const resp = await requester().post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);

            const { body } = await requester()
                .put(`/profile/${resp.body._id as string}/update`)
                .send(userUpdateRequest)
                .expect(HttpStatusCode.OK);

            const responseProps = Object.keys(body);
            const userProps = Object.keys({ ...postUserSerializer({}), details: {} });

            expect(responseProps).toEqual(userProps);
            expect(body.nickname).toBe(userUpdateRequest.nickname);
            expect(body.picture).toBe(userUpdateRequest.picture);
            expect(body.details.firstName).toBe(userUpdateRequest.details.firstName);
            expect(body.details.lastName).toBe(userUpdateRequest.details.lastName);
        });
    });
});
