import sinon from 'sinon';
import PostSupportEmailOperation from 'src/core/users/operations/users/PostSupportEmailOperation';

describe('Core :: Users :: Operations :: PostSupportEmailOperation', () => {
    it('should delegate the payload to the service', async () => {
        const postSupportEmailService = {
            sendEmail: sinon.spy(() => ({})),
        };

        const postSupportEmailOperation = new PostSupportEmailOperation({
            postSupportEmailService,
            logger: (): void => {},
        } as any);

        const payload = {
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            payload: {
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
                category: 'Autenticacao',
                campaignCode: 'ABC123',
            },
        };

        await postSupportEmailOperation.execute(payload);

        expect(postSupportEmailService.sendEmail).to.have.been.calledWith(payload);
    });
});
