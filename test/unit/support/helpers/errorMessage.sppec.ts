import { errorMessage } from "src/support/helpers/errorMessage";

describe('Helpers :: errorMessage', () => {
    describe('When the errorMessage is called', () => {
        it('should have the correct properties', () => {
            const notFoundKeys = [   
                'armor',
                'background',
                'classe',
                'feat',
                'god',
                'item',
                'magicItem',
                'monster',
                'race',
                'realm',
                'spell',
                'system',
                'weapon',
                'wiki',
            ];

            const errorMessageKeys = ['notFound', 'badRequest', 'forbidden', 'unprocessableEntity'];
            const badRequestKeysSystemDefault = ['responseActive', 'payloadActive'];
            const badRequestKeys = ["system", "default"];
            
            const keysErrorMsg = (Object.keys(errorMessage));
            const keysNotFound = (Object.keys(errorMessage.notFound));
            const keysBadRequest = (Object.keys(errorMessage.badRequest));
            const keysBadRequestSystem = (Object.keys(errorMessage.badRequest.system));
            const keysBadRequestDefault = (Object.keys(errorMessage.badRequest.default));

            keysErrorMsg.forEach((key, index) => { expect(key).toBe(errorMessageKeys[index]) });
            keysNotFound.forEach((key, index) => { expect(key).toBe(notFoundKeys[index]) });
            keysBadRequest.forEach((key, index) => { expect(key).toBe(badRequestKeys[index]) });
            keysBadRequestDefault.forEach((key, index) => { expect(key).toBe(badRequestKeysSystemDefault[index]) });
            keysBadRequestSystem.forEach((key, index) => { expect(key).toBe(badRequestKeysSystemDefault[index]) });
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