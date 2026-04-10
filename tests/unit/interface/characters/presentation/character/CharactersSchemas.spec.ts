import CharactersSchemas from 'src/interface/characters/presentation/character/CharactersSchemas';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersSchemas', () => {
    context('When the schemas factory is called', () => {
        it('should return object with all expected schema keys', () => {
            const schemas = CharactersSchemas();

            expect(schemas).to.have.property('postCreateCharacter');
            expect(schemas).to.have.property('putUpdateCharacter');
            expect(schemas).to.have.property('postOrganizationPicture');
            expect(schemas).to.have.property('postCharacterPicture');
        });
    });
});
