import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import requester from '../../support/requester';
import mock from 'src/infra/mocks/user';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import EmailSender from 'src/infra/helpers/user/EmailSender';
import logger from '@tablerise/dynamic-logger';
import newUUID from 'src/infra/helpers/user/newUUID';

describe('Add verify code in database', () => {
    const userInstanceMock = mock.user.user;
    userInstanceMock.email = `${Math.random()}${userInstanceMock.email}`;

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

    describe('When send a verification code', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: '' });
        });

        it('should return correct status', async () => {
            userInstanceMock.inProgress.status = 'done';
            userInstanceMock.userId = newUUID();
            const userTest = await new DatabaseManagement().modelInstance('user', 'Users').create(userInstanceMock);
            await requester()
                .get(`/profile/${userTest._id as string}/verify`)
                .expect(HttpStatusCode.OK);
        });
    });
});
