import { ErrorMessage } from 'src/domains/common/helpers/errorMessage';

describe('Domains :: User :: Helpers :: GetMessage', () => {
    it('ErrorMessage properties must be strings', () => {
        for (const message of Object.values(ErrorMessage)) {
            expect(message).to.be.a('string');
        }
    });

    it('Should return the correct error messages from Enum ErrorMessage', () => {
        const expectedMessages = {
            NOT_FOUND_BY_ID: 'NotFound an object with provided ID',
            BAD_REQUEST: 'Not possible to change availability through this route',
            UNPROCESSABLE_ENTITY: 'An entity name is required',
        };

        for (const [key, value] of Object.entries(ErrorMessage)) {
            expect(value).to.be.equal(expectedMessages[key as keyof typeof ErrorMessage]);
        }
    });
});
