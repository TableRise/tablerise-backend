import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When user authenticates via two-factor', () => {
    context('And the 2FA middleware is satisfied', () => {
        it('should return 200 OK with locals', async () => {
            const { body } = await requester()
                .post('/users/authenticate/2fa')
                .query({ email: 'any@test.com', token: '123456', flow: 'create-user' })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
        });
    });
});
