import DatabaseManagement, { mongoose } from '@tablerise/database-management';
import logger from '@tablerise/dynamic-logger';
import requester from '../../support/requester';
import mock from 'src/support/mocks/user';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import EmailSender from 'src/services/user/helpers/EmailSender';

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
        picture: 'https://imgbb.com/mock_test_update',
        details: {
          firstName: 'mock_test_update_fn',
          lastName: 'mock_test_update_ln',
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
            const userResponse = await requester.post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);

            const { body } = await requester.put(`/profile/${userResponse.body._id as string}/update`).send(userUpdateRequest).expect(HttpStatusCode.OK);

            const responseProps = Object.keys(body);
            const userProps = ['_id','inProgress','providerId','email','password','nickname','tag', 'picture','twoFactorSecret','createdAt', 'updatedAt','details'];

            expect(responseProps).toEqual(userProps);
            expect(body.nickname).toBe(userUpdateRequest.nickname);
            expect(body.picture).toBe(userUpdateRequest.picture);
            expect(body.details.firstName).toBe(userUpdateRequest.details.firstName);
            expect(body.details.lastName).toBe(userUpdateRequest.details.lastName);
        });

        it('should throw an error when user.details has a forbidden field', async () => {
            userPayload.email = `${Math.random()}${userInstanceMock.email}`;
        
            const userUpdateRequestForbidden = { ...userUpdateRequest,  details: { secretQuestion: "mock_fail", role: 'mock' } };
            const firstForbiddenField = Object.keys(userUpdateRequestForbidden.details)
                .find((field) => (field === 'secretQuestion' || field === 'role' ));

            const userResponse = await requester.post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);
            const { body } = await requester.put(`/profile/${userResponse.body._id as string}/update`).send(userUpdateRequestForbidden).expect(HttpStatusCode.FORBIDDEN);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Update UserDetails Info - ${firstForbiddenField as string} is a forbidden field  and cannot be updated through this request`);
            expect(body.name).toBe('ForbiddenRequest');
        });

        it('should throw an error when user has a forbidden field', async () => {
            userPayload.email = `${Math.random()}${userInstanceMock.email}`;

            const userUpdateRequestForbidden = { ...userUpdateRequest,  email:"mock_update@fail", password:'mock_fail', };
            const firstForbiddenField = Object.keys(userUpdateRequestForbidden)
                .find((field) => (field === 'password' || field === 'email' ));

            const userResponse = await requester.post('/profile/register').send(userPayload).expect(HttpStatusCode.CREATED);
            const { body } = await requester.put(`/profile/${userResponse.body._id as string}/update`).send(userUpdateRequestForbidden).expect(HttpStatusCode.FORBIDDEN);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Update User Info - ${firstForbiddenField as string} is a forbidden field  and cannot be updated through this request`);
            expect(body.name).toBe('ForbiddenRequest');
        });
    });
});