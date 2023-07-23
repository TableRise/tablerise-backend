import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

describe('Helpers :: HttpStatusCode', () => {
    describe('When the enum is called', () => {
        it('should have the correct keys', () => {
            const enumKeys = [
                'OK',
                'CREATED',
                'DELETED',
                'BAD_REQUEST',
                'UNAUTHORIZED',
                'FORBIDDEN',
                'NOT_FOUND',
                'UNPROCESSABLE_ENTITY',
                'INTERNAL_SERVER',
            ];
            const enumKeysDeclared = Object.keys(HttpStatusCode).filter((key: any) => isNaN(key));

            enumKeys.forEach((key, index) => {
                expect(key).toBe(enumKeysDeclared[index]);
            });
        });

        it('should have the correct values', () => {
            const enumValues = [200, 201, 204, 400, 401, 403, 404, 422, 500];
            const enumValuesDeclared = Object.values(HttpStatusCode).filter((key: any) => !isNaN(key));

            enumValues.forEach((value, index) => {
                expect(value).toBe(enumValuesDeclared[index]);
            });
        });
    });
});
