import CharactersSchemas from 'src/interface/characters/presentation/character/CharactersSchemas';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersSchemas', () => {
    context('When the schemas factory is called', () => {
        it('should return object with all expected schema keys', () => {
            const schemas = CharactersSchemas();

            expect(schemas).to.have.property('postCreateCharacter');
            expect(schemas).to.have.property('putUpdateCharacter');
            expect(schemas).to.have.property('postCharacterPicture');
        });

        it('should validate character picture uploads for browser and multer file objects', () => {
            const schemas = CharactersSchemas();

            expect(() =>
                schemas.postCharacterPicture.body.parse({
                    picture: new File(['character'], 'character.png', { type: 'image/png' }),
                })
            ).to.not.throw();

            expect(() =>
                schemas.postCharacterPicture.body.parse({
                    picture: {
                        fieldname: 'picture',
                        originalname: 'character.png',
                        mimetype: 'image/png',
                        buffer: Buffer.from('character'),
                    },
                })
            ).to.not.throw();

            expect(() =>
                schemas.postCharacterPicture.body.parse({
                    imageObject: JSON.stringify({
                        id: 'image-1',
                        link: 'https://img.bb/character',
                        uploadDate: '2026-06-06T00:00:00.000Z',
                        deleteUrl: '',
                        request: { success: true, status: 200 },
                    }),
                })
            ).to.not.throw();
        });
    });
});
