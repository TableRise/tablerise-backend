import { routeOriginal } from '@tablerise/auto-swagger';
import mocks from 'src/support/mocks/user';
import generateIDParam, { generateQueryParam } from '../parametersWrapper';

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
    ['/profile/register', 'profile', 'post', null, registerUserPayloadSchema, false],
    ['/profile/login', 'profile', 'post', null, loginUserPayloadSchema, false],
    ['/profile/two-factor/{_id}', 'profile', 'post', [
        ...generateIDParam(),
        ...generateQueryParam(1, [{ name: 'token', type: 'string' }])
    ], null, false],
] as routeOriginal;
