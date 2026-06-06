import UsersSchemas from 'src/interface/users/presentation/users/UsersSchemas';

describe('Interface :: Users :: Presentation :: Users :: UsersSchemas', () => {
    it('should expose the support email schema', () => {
        const schemas = UsersSchemas();

        expect(schemas).to.have.property('postSupportEmail');
        expect(schemas).to.have.property('postDonate');
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

    it('should validate user cover payloads for both browser and multer uploads', () => {
        const schemas = UsersSchemas();

        expect(() =>
            schemas.patchUpdateUserCover.body.parse({
                image: new File(['cover'], 'cover.png', { type: 'image/png' }),
            })
        ).to.not.throw();

        expect(() =>
            schemas.patchUpdateUserCover.body.parse({
                image: {
                    fieldname: 'image',
                    originalname: 'cover.png',
                    mimetype: 'image/png',
                    buffer: Buffer.from('cover'),
                },
            })
        ).to.not.throw();

        expect(() =>
            schemas.patchUpdateUserCover.body.parse({
                image: 'invalid-file',
            })
        ).to.throw();
    });

    it('should parse the donation validation query flag', () => {
        const schemas = UsersSchemas();

        expect(schemas.postDonate.query.parse({ validation: 'true' })).to.deep.equal({ validation: true });
        expect(schemas.postDonate.query.parse({ validation: 'false' })).to.deep.equal({ validation: false });
        expect(() => schemas.postDonate.query.parse({ validation: 'not-a-boolean' })).to.throw();
    });

    it('should validate donation payloads and allow nickname to stay optional at schema level', () => {
        const schemas = UsersSchemas();

        expect(() =>
            schemas.postDonate.body.parse({
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            })
        ).to.not.throw();

        expect(() =>
            schemas.postDonate.body.parse({
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                nickname: 'Lia',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            })
        ).to.not.throw();

        expect(() =>
            schemas.postDonate.body.parse({
                value: 15,
                timestamp: 'invalid-date',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            })
        ).to.throw();
    });
});
