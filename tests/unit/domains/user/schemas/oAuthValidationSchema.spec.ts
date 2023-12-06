import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import {
    CompleteOAuthPayload,
    oAuthCompleteZodSchema,
} from 'src/domains/user/schemas/oAuthValidationSchema';

describe('Domains :: User :: Schemas :: UserDetailsValidationSchema', () => {
    let completeOAuthData: CompleteOAuthPayload;

    const schemaValidator = new SchemaValidator();

    context('When data is correct with schema', () => {
        beforeEach(() => {
            completeOAuthData = {
                nickname: 'usb',
                firstName: 'Jhon',
                lastName: 'Doe',
                pronoun: 'he/his',
                birthday: '2000-10-10',
                biography: 'Test',
            };
        });

        it('should not have errors', () => {
            try {
                schemaValidator.entry(oAuthCompleteZodSchema, completeOAuthData);
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
        });
    });

    context('When data is not correct with schema', () => {
        beforeEach(() => {
            completeOAuthData = {
                nickname: 'usb',
                lastName: 'Doe',
                pronoun: 'he/his',
                birthday: '2000-10-10',
                biography: 'Test',
            } as CompleteOAuthPayload;
        });

        it('should throw errors', () => {
            try {
                schemaValidator.entry(oAuthCompleteZodSchema, completeOAuthData);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');

                expect(err.details).to.have.length(1);
                expect(err.details[0].attribute).to.be.equal('firstName');
                expect(err.details[0].reason).to.be.equal('Invalid input');
            }
        });
    });
});
