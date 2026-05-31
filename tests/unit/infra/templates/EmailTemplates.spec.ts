import confirmEmailTemplate from 'src/infra/templates/confirmEmailTemplate';
import supportEmailTemplate from 'src/infra/templates/supportEmailTemplate';
import verifyEmailTemplate from 'src/infra/templates/verifyEmailTemplate';

describe('Infra :: Templates :: EmailTemplates', () => {
    it('should render the confirmation template with the shared layout', () => {
        const html = confirmEmailTemplate('ABC123', 'Joe');

        expect(html).to.contain('Confirme seu cadastro');
        expect(html).to.contain('ABC123');
        expect(html).to.contain('class="img-bg"');
        expect(html).to.contain('purple-lost-city.png');
        expect(html).to.not.contain('<img');
    });

    it('should render the verification template with the shared layout', () => {
        const html = verifyEmailTemplate('ZXCVBN', 'Joe');

        expect(html).to.contain('Verifique seu email');
        expect(html).to.contain('ZXCVBN');
        expect(html).to.contain('class="img-bg"');
        expect(html).to.contain('putple-forest.png');
        expect(html).to.not.contain('<img');
    });

    it('should render the support template with optional campaign code', () => {
        const html = supportEmailTemplate({
            title: 'Nao consigo entrar',
            category: 'Autenticacao',
            content: 'Meu codigo nao chega.',
            senderName: 'Joe Einstein',
            senderEmail: 'joe@email.com',
            campaignCode: 'ABC123',
        });

        expect(html).to.contain('Nao consigo entrar');
        expect(html).to.contain('Autenticacao');
        expect(html).to.contain('Joe Einstein');
        expect(html).to.contain('joe@email.com');
        expect(html).to.contain('ABC123');
        expect(html).to.contain('class="img-bg"');
        expect(html).to.contain('orange-lost-city.png');
    });

    it('should omit the campaign code section when it is not provided', () => {
        const html = supportEmailTemplate({
            title: 'Nao consigo entrar',
            category: 'Autenticacao',
            content: 'Meu codigo nao chega.',
            senderName: 'Joe Einstein',
            senderEmail: 'joe@email.com',
        });

        expect(html).to.not.contain('Codigo da campanha');
    });
});
