import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import EmailSender from 'src/services/user/helpers/EmailSender';
import { toIncludeSameMembers } from 'jest-extended'
expect.extend({ toIncludeSameMembers });
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import user from 'src/schemas/user';

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
        twoFactorSecret: { "active": true },
        picture: 'https://imgbb.com/mock_test',
        details: {
          firstName: 'mock_test',
          lastName: 'update_test',
          pronoun: 'he/his',
          birthday: '2000/10/10',
          biography: 'I am a mock update test, do not trust me',
        }
    }

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
            const id = userDetailsInstanceMock.userId as string;
            const userResponse = await requester.post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);
            console.log('ID:', userResponse.body, userResponse.body._id);
            const response = await requester.put(`/profile/${userResponse.body._id as string}/update`).send(userUpdateRequest).expect(HttpStatusCode.OK);

            const responseProps = Object.keys(response.body);
            const userProps = Object.keys({...userInstanceMock, details: userDetailsInstanceMock});
            console.log('test 59',response.body, responseProps, userProps);
            expect((responseProps).toIncludeAllMembers([
                '_id',        'inProgress',
                'providerId', 'email',
                'password',   'nickname',
                'tag',        'picture',
                'createdAt',  'updatedAt',
                'details'
              ]));
            // expect(response.body).toHaveProperty('tag');
            // expect(response.body).toHaveProperty('createdAt');
            // expect(response.body).toHaveProperty('updatedAt');
            // expect(response.body).toHaveProperty('details');
            // expect(response.body).toHaveProperty('nickname');
            // expect(response.body).toHaveProperty('picture');
            // expect(response.body).toHaveProperty('details');
            // expect(response.body.details).toHaveProperty('userId');
            // expect(response.body.details).toHaveProperty('firstName');
            // expect(response.body.details).toHaveProperty('lastName');
            // expect(response.body.email).toBe(userPayload.email);
            // expect(response.body.nickname).toBe(userPayload.nickname);


            // const userResponseProps = Object.keys(response);
        });
    });
});