import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import { uuidV4Schema } from 'src/domains/common/schemas/commonValidationSchema';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Domains :: User :: Schemas :: UsersValidationSchema', () => {
    let uuid: string;

    const schemaValidator = new SchemaValidator();

    context('When data is correct with schema', () => {
        beforeEach(() => {
            uuid = newUUID();
        });

        it('should not have errors', () => {
            try {
                schemaValidator.entry(uuidV4Schema, uuid);
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
        });
    });

    context('When data is not correct with schema', () => {
        beforeEach(() => {
            uuid = newUUID();
        });

        it('should throw errors', () => {
            try {
                schemaValidator.entry(uuidV4Schema, '123');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');

                expect(err.details).to.have.length(1);
                expect(err.details[0].reason).to.be.equal(
                    'String must contain exactly 36 character(s)'
                );
            }
        });
    });
});
