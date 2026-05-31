import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When an authenticated user sends a support email', () => {
    it('should send the support email successfully', async () => {
        await requester()
            .post('/users/12cd093b-0a8a-42fe-910f-001f2ab28454/support/post')
            .send({
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
                category: 'Autenticacao',
                campaignCode: 'ABC123',
            })
            .expect(HttpStatusCode.NO_CONTENT);
    });
});
