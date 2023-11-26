import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import userDetailsZodSchema, {
    UserDetailInstance,
} from 'src/domains/user/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: User :: Schemas :: UserDetailsValidationSchema', () => {
    let userDetails: UserDetailInstance[];

    const schemaValidator = new SchemaValidator();

    context('When data is correct with schema', () => {
        beforeEach(() => {
            userDetails = DomainDataFaker.generateUserDetailsJSON().map((userDetail) => {
                // @ts-expect-error expected delete;
                delete userDetail.userId;
                // @ts-expect-error expected delete;
                delete userDetail.userDetailId;

                return userDetail;
            });
        });

        it('should not have errors', () => {
            try {
                schemaValidator.entry(userDetailsZodSchema, userDetails[0]);
            } catch (error) {
                expect('it should not be here').to.be.equal(false);
            }
        });
    });

    context('When data is not correct with schema', () => {
        beforeEach(() => {
            userDetails = DomainDataFaker.generateUserDetailsJSON().map((userDetail) => {
                // @ts-expect-error expected delete;
                delete userDetail.userId;
                // @ts-expect-error expected delete;
                delete userDetail.userDetailId;
                // @ts-expect-error expected delete;
                delete userDetail.firstName;

                return userDetail;
            });
        });

        it('should throw errors', () => {
            try {
                schemaValidator.entry(userDetailsZodSchema, userDetails[0]);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).to.be.equal('Schema error');
                expect(err.code).to.be.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
                expect(err.name).to.be.equal('UnprocessableEntity');

                expect(err.details).to.have.length(1);
                expect(err.details[0].attribute).to.be.equal('firstName');
                expect(err.details[0].reason).to.be.equal('Required');
            }
        });
    });
});
