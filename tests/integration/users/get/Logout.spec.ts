import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When user logs out', () => {
    context('And the token is valid', () => {
        it('should return 204 No Content and invalidate the token', async () => {
            await requester().get('/users/logout').expect(HttpStatusCode.NO_CONTENT);
        });
    });
});
