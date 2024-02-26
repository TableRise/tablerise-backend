import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Domains :: User :: Helpers :: GetErrorName', () => {
    const codes = {
        NOT_FOUND: 'NotFound',
        BAD_REQUEST: 'BadRequest',
        UNPROCESSABLE_ENTITY: 'UnprocessableEntity',
        FORBIDDEN: 'ForbiddenRequest',
        UNAUTHORIZED: 'Unauthorized',
        INTERNAL_SERVER: 'InternalServerError',
    };

    it('Should return a string', () => {
        for (const key in codes) {
            expect(getErrorName(HttpStatusCode[key as keyof typeof HttpStatusCode])).to.be.a(
                'string'
            );
        }
    });

    it('Should return expected string', () => {
        for (const [key, value] of Object.entries(codes)) {
            expect(
                getErrorName(HttpStatusCode[key as keyof typeof HttpStatusCode])
            ).to.be.equal(value);
        }
    });

    it('Should throw an error if parameter is invalid', () => {
        const invalidParameter = 99;
        expect(() => getErrorName(invalidParameter)).to.throw(
            `This ${invalidParameter} is not valid, check the code List at HttpStatusCode.`
        );
    });
});
