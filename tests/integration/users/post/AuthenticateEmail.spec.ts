import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When user authenticates via email code', () => {
    context('And the email code middleware is satisfied', () => {
        it('should return 200 OK with locals', async () => {
            const { body } = await requester()
                .post('/users/authenticate/email')
                .query({ email: 'any@test.com', code: 'LOKI74', flow: 'create-user' })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
        });
    });
});
