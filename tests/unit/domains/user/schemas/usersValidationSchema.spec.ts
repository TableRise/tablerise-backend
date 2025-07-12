import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import usersZodSchema, { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: User :: Schemas :: UsersValidationSchema', () => {
    let user: UserInstance[];

    const schemaValidator = new SchemaValidator();

    context('When data is correct with schema', () => {
        beforeEach(() => {
            user = DomainDataFaker.generateUsersJSON().map((user) => ({
                email: user.email,
                password: user.password,
                nickname: user.nickname,
                picture: user.picture,
                twoFactorSecret: user.twoFactorSecret,
            })) as UserInstance[];
        });

        it('should not have errors', () => {
            try {
                schemaValidator.entry(usersZodSchema, user[0]);
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
        });
    });

    context('When data is not correct with schema', () => {
        beforeEach(() => {
            user = DomainDataFaker.generateUsersJSON().map((user) => ({
                email: user.email,
                nickname: user.nickname,
                picture: user.picture,
                twoFactorSecret: user.twoFactorSecret,
            })) as UserInstance[];
        });

        it('should throw errors', () => {
            try {
                schemaValidator.entry(usersZodSchema, user[0]);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');

                expect(err.details).to.have.length(1);
                expect(err.details[0].attribute).to.be.equal('password');
                expect(err.details[0].reason).to.be.equal('Required');
            }
        });
    });
});
