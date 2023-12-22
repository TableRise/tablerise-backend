import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import usersZodSchema, {
    UserInstance,
} from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: Common :: Helpers :: SchemaValidator', () => {
    let user: UserInstance[];
    let schemaValidator: SchemaValidator;

    context('#validateEntry', () => {
        beforeEach(() => {
            schemaValidator = new SchemaValidator();

            user = DomainDataFaker.generateUsersJSON().map((user) => ({
                email: user.email,
                password: user.password,
                nickname: user.nickname,
                picture: user.picture,
                twoFactorSecret: user.twoFactorSecret,
            })) as UserInstance[];
        });

        it('should return nothing if success', () => {
            try {
                schemaValidator.entry(usersZodSchema, user[0]);
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
        });

        it('should thrown an error if fail', () => {
            try {
                schemaValidator.entry(usersZodSchema, {
                    nickname: 123,
                    email: 'test@email.com',
                    password: '@124Kll*',
                });
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
            user = DomainDataFaker.generateUsersJSON().map((user) => ({
                email: user.email,
                password: user.password,
                nickname: user.nickname,
                picture: user.picture,
                twoFactorSecret: user.twoFactorSecret,
            })) as UserInstance[];

            schemaValidator = new SchemaValidator();
        });

        it('should return null if success', () => {
            const validateTest = schemaValidator.entryReturn(usersZodSchema, user[0]);
            expect(validateTest).to.be.equal(null);
        });

        it('should return zodError if failed', () => {
            const validateTest: any = schemaValidator.entryReturn(usersZodSchema, {
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

        it('should return nothing if success', () => {
            try {
                schemaValidator.existance(false, '');
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
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
