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

    it('should validate profile picture payloads for both browser and multer uploads', () => {
        const schemas = UsersSchemas();

        expect(() =>
            schemas.postUpdateUserProfilePicture.body.parse({
                picture: new File(['cover'], 'cover.png', { type: 'image/png' }),
            })
        ).to.not.throw();

        expect(() =>
            schemas.postUpdateUserProfilePicture.body.parse({
                picture: {
                    fieldname: 'picture',
                    originalname: 'cover.png',
                    mimetype: 'image/png',
                    buffer: Buffer.from('cover'),
                },
            })
        ).to.not.throw();
    });
});
