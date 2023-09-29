import getErrorName from 'src/services/helpers/getErrorName';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';

describe('Helpers :: getErrorName', () => {
    describe('When the getErrorName is called', () => {
        it('should return the correct errorName', () => {
            expect(getErrorName(HttpStatusCode.NOT_FOUND)).toBe('NotFound');
            expect(getErrorName(HttpStatusCode.BAD_REQUEST)).toBe('BadRequest');
            expect(getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY)).toBe('ValidationError');
            expect(getErrorName(HttpStatusCode.FORBIDDEN)).toBe('ForbiddenRequest');
            expect(getErrorName(HttpStatusCode.UNAUTHORIZED)).toBe('Unauthorized');
        });

        it('should throw an Error', () => {
            const invalidCode = 400999;
            let codeName = 'EMPTY';
            try {
                codeName = getErrorName(invalidCode);
                expect(codeName).toBe('EMPTY');
                expect(getErrorName).toThrow();
            } catch (error) {
                const codeNotFound = error as Error;
                expect(codeNotFound).toHaveProperty('message');
                expect(codeNotFound.message).toBe(
                    `This ${invalidCode} is not valid, check the code List at HttpStatusCode.`
                );
            }
        });
    });
});
