import UsersSchemas from 'src/interface/users/presentation/users/UsersSchemas';

describe('Interface :: Users :: Presentation :: Users :: UsersSchemas', () => {
    it('should expose the support email schema', () => {
        const schemas = UsersSchemas();

        expect(schemas).to.have.property('postSupportEmail');
    });

    it('should validate support email payloads with optional campaign code', () => {
        const schemas = UsersSchemas();

        expect(() =>
            schemas.postSupportEmail.body.parse({
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
                category: 'Autenticacao',
            })
        ).to.not.throw();

        expect(() =>
            schemas.postSupportEmail.body.parse({
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
                category: 'Autenticacao',
                campaignCode: 'ABC123',
            })
        ).to.not.throw();

        expect(() =>
            schemas.postSupportEmail.body.parse({
                title: 'Nao consigo entrar',
                content: 'Meu codigo nao chega.',
            })
        ).to.throw();
    });
});
