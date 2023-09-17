import { routeOriginal } from '@tablerise/auto-swagger';
import mocks from 'src/support/mocks/user';

const userInstance = mocks.user.user;
const { providerId: _, tag: _1, createdAt: _2, updatedAt: _3, ...userPayload } = userInstance;

export default [
    ['/auth/google', 'OAuth', 'get', null, null, false],
    ['/auth/facebook', 'OAuth', 'get', null, null, false],
    ['/auth/register', 'Auth', 'post', null, userPayload, false]
] as routeOriginal;
