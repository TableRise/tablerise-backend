import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import schemas from 'src/domains/user/schemas';

describe('Domains :: Common :: Helpers :: SchemaValidator', () => {
    let schemaValidator: SchemaValidator;

    const payload = {
        nickname: 'Jojo',
        firstName: 'João',
        lastName: 'da Silva',
        pronoun: 'he/his',
        birthday: '01/01/2001',
        biography: 'Menino astuto',
    };

    context('#validateEntry', () => {
        beforeEach(() => {
            schemaValidator = new SchemaValidator();
        });

        it('should return nothing if success', () => {
            schemaValidator.entry(schemas.oAuthComplete, payload);
        });

        it('should thrown an error if fail', () => {
            try {
                schemaValidator.entry(schemas.oAuthComplete, { nickname: 123 });
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');
            }
        });
    });

    context('#validateEntryReturn', () => {
        beforeEach(() => {
            schemaValidator = new SchemaValidator();
        });

        it('should return null if success', () => {
            const validateTest = schemaValidator.entryReturn(
                schemas.oAuthComplete,
                payload
            );
            expect(validateTest).to.be.equal(null);
        });

        it('should return zodError if failed', () => {
            const validateTest: any = schemaValidator.entryReturn(schemas.oAuthComplete, {
                nickname: 123,
            });
            expect(validateTest).to.have.property('success');
            expect(validateTest.success).to.be.equal(false);
        });
    });

    context('#validateExistence', () => {
        beforeEach(() => {
            schemaValidator = new SchemaValidator();
        });

        it('should thrown an error if fail', () => {
            try {
                schemaValidator.existance(true, 'bad request test error');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('bad request test error');
                expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                expect(err.name).to.be.equal('BadRequest');
            }
        });
    });
});
