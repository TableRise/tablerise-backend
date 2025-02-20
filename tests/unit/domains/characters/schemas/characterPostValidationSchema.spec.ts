import characterPostZodSchema from 'src/domains/characters/schemas/characterPostValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';

describe('Domains :: Characters :: Schemas :: CharactersValidationSchema', () => {
    let character: any;

    const schemaValidator = new SchemaValidator();

    context('When data is correct with schema', () => {
        beforeEach(() => {
            character = DomainDataFaker.mocks.createCharacterMock;
        });

        it('should not have errors', () => {
            try {
                schemaValidator.entry(characterPostZodSchema, character);
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
        });
    });

    context('When data is not correct with schema', () => {
        beforeEach(() => {
            character = DomainDataFaker.mocks.createCharacterMock;
            delete character.data;
        });

        it('should throw errors', () => {
            try {
                schemaValidator.entry(characterPostZodSchema, character);
                expect('it should not be here').to.be.equal(false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');

                expect(err.details).to.have.length(1);
                expect(err.details[0].attribute).to.be.equal('data');
                expect(err.details[0].reason).to.be.equal('Required');
            }
        });
    });
});
