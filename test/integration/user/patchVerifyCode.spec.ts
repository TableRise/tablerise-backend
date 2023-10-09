import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import EmailSender from 'src/services/user/helpers/EmailSender';

describe('Add verify code in database', () => {
    const userInstanceMock = mock.user.user;
    userInstanceMock.email = `${Math.random()}${userInstanceMock.email}`;

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

    describe('When send a verification code', () => {
        beforeAll(() => {
            jest.spyOn(EmailSender.prototype, 'send').mockResolvedValue({ success: true, verificationCode: '' });
        });

        it('should return correct status', async () => {
            // @ts-expect-error In progress will exist below
            userInstanceMock.inProgress.status = 'done';
            userInstanceMock._id = generateNewMongoID();
            const userTest = await new DatabaseManagement().modelInstance('user', 'Users').create(userInstanceMock);
            await requester.get(`/profile/${userTest._id as string}/verify`).expect(HttpStatusCode.OK);
        });
    });
});
