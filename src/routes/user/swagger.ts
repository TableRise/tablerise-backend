import { routeOriginal } from '@tablerise/auto-swagger';
import mocks from 'src/support/mocks/user';
import generateIDParam, { generateQueryParam } from 'src/routes/parametersWrapper';

const userInstance = mocks.user.user;
const { providerId: _, tag: _1, createdAt: _2, updatedAt: _3, ...userPayload } = userInstance;

const userDetailsInstance = mocks.user.userDetails;
const { userId: _4, ...userDetailsPayload } = userDetailsInstance;

const registerUserPayloadSchema = {
    ...userPayload,
    details: userDetailsPayload,
};

const loginUserPayloadSchema = mocks.user.userLogin;

export default [
    ['/auth/discord', 'auth', 'get', null, null, false],
    ['/auth/google', 'auth', 'get', null, null, false],
    ['/auth/facebook', 'auth', 'get', null, null, false],
    ['/profile/{_id}/verify', 'profile', 'get', [...generateIDParam()], null, false],
    ['/profile/register', 'profile', 'post', null, registerUserPayloadSchema, false],
    ['/profile/login', 'profile', 'post', null, loginUserPayloadSchema, false],
    ['/profile/{_id}/2fa/activate', 'profile', 'patch', [...generateIDParam()], null, true],
    [
        '/profile/{_id}/confirm',
        'profile',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'code', type: 'string' }])],
        null,
        false,
    ],
    [
        '/profile/{_id}/delete',
        'profile',
        'delete',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'code', type: 'string' }])],
        null,
        true,
    ],
] as routeOriginal;
