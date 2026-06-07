import { getAllowedCorsOrigins, isAllowedCorsOrigin } from 'src/domains/common/helpers/corsOrigins';

describe('Domains :: Common :: Helpers :: corsOrigins', () => {
    const previousOrigin1 = process.env.CORS_ORIGIN_1;
    const previousOrigin2 = process.env.CORS_ORIGIN_2;
    const previousOrigin = process.env.CORS_ORIGIN;

    beforeEach(() => {
        process.env.CORS_ORIGIN_1 = 'http://localhost:3000';
        process.env.CORS_ORIGIN_2 = 'https://tablerise.com';
        process.env.CORS_ORIGIN = 'http://legacy-origin.test';
    });

    afterEach(() => {
        process.env.CORS_ORIGIN_1 = previousOrigin1;
        process.env.CORS_ORIGIN_2 = previousOrigin2;
        process.env.CORS_ORIGIN = previousOrigin;
    });

    it('should return the configured origins without empty values', () => {
        process.env.CORS_ORIGIN_2 = '';

        expect(getAllowedCorsOrigins()).to.deep.equal(['http://localhost:3000', 'http://legacy-origin.test']);
    });

    it('should allow requests without an origin header', () => {
        expect(isAllowedCorsOrigin(undefined)).to.equal(true);
    });

    it('should allow configured origins and reject unknown ones', () => {
        expect(isAllowedCorsOrigin('http://localhost:3000')).to.equal(true);
        expect(isAllowedCorsOrigin('https://tablerise.com')).to.equal(true);
        expect(isAllowedCorsOrigin('http://localhost:3001')).to.equal(false);
    });
});
