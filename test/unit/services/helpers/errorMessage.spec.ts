import { ErrorMessage } from 'src/services/helpers/errorMessage';

describe('Helpers :: errorMessage', () => {
    describe('When the errorMessage is called', () => {
        it('should return the correct key', () => {
            const errorMessageKeys = ['NOT_FOUND_BY_ID', 'BAD_REQUEST', 'UNPROCESSABLE_ENTITY'];

            const keysErrorMsg = Object.keys(ErrorMessage);

            keysErrorMsg.forEach((key, index) => {
                expect(key).toBe(errorMessageKeys[index]);
            });
        });

        it('should have the correct message for each key', () => {
            const corretErrorMessages = [
                'NotFound an object with provided ID',
                'Not possible to change availability through this route',
                'An entity name is required',
            ];

            Object.values(ErrorMessage).forEach((errorMsg, index) => {
                expect(JSON.stringify(errorMsg).length).toBeGreaterThan(0);
                expect(JSON.stringify(errorMsg)).toBe(JSON.stringify(corretErrorMessages[index]));
            });
        });
    });
});
