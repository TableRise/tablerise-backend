import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

describe('Domains :: Common :: Helpers :: HttpStatusCode', () => {
    describe('When the enum is called', () => {
        it('should have the correct keys', () => {
            const enumKeys = [
                'OK',
                'CREATED',
                'NO_CONTENT',
                'BAD_REQUEST',
                'UNAUTHORIZED',
                'FORBIDDEN',
                'NOT_FOUND',
                'UNPROCESSABLE_ENTITY',
                'INTERNAL_SERVER',
                'EXTERNAL_ERROR',
            ];
            const enumKeysDeclared = Object.keys(HttpStatusCode).filter((key: any) => isNaN(key));

            expect(enumKeys.length).to.be.equal(enumKeysDeclared.length);
            enumKeys.forEach((key, index) => {
                expect(key).to.be.equal(enumKeysDeclared[index]);
            });
        });

        it('should have the correct values', () => {
            const enumValues = [200, 201, 204, 400, 401, 403, 404, 422, 500, 502];
            const enumValuesDeclared = Object.values(HttpStatusCode).filter(
                (key: any) => !isNaN(key)
            );

            expect(enumValues.length).to.be.equal(enumValuesDeclared.length);
            enumValues.forEach((value, index) => {
                expect(value).to.be.equal(enumValuesDeclared[index]);
            });
        });
    });
});
