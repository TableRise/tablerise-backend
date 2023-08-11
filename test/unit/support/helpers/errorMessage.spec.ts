import { errorMessage } from 'src/support/helpers/errorMessage';

describe('Helpers :: errorMessage', () => {
    describe('When the errorMessage is called', () => {
        it('should return the correct', () => {
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
            const badRequestKeys = ['system', 'default'];

            const keysErrorMsg = Object.keys(errorMessage);
            const keysNotFound = Object.keys(errorMessage.notFound);
            const keysBadRequest = Object.keys(errorMessage.badRequest);
            const keysBadRequestSystem = Object.keys(errorMessage.badRequest.system);
            const keysBadRequestDefault = Object.keys(errorMessage.badRequest.default);

            keysErrorMsg.forEach((key, index) => {
                expect(key).toBe(errorMessageKeys[index]);
            });
            keysNotFound.forEach((key, index) => {
                expect(key).toBe(notFoundKeys[index]);
            });
            keysBadRequest.forEach((key, index) => {
                expect(key).toBe(badRequestKeys[index]);
            });
            keysBadRequestDefault.forEach((key, index) => {
                expect(key).toBe(badRequestKeysSystemDefault[index]);
            });
            keysBadRequestSystem.forEach((key, index) => {
                expect(key).toBe(badRequestKeysSystemDefault[index]);
            });
        });

        it('should have the correct messages', () => {
            const corretErrorMessages = [
                {
                    armor: 'NotFound an armor with provided ID',
                    background: 'NotFound a background with provided ID',
                    classe: 'NotFound a class with provided ID',
                    feat: 'NotFound a feat with provided ID',
                    god: 'NotFound a god with provided ID',
                    item: 'NotFound an item with provided ID',
                    magicItem: 'NotFound a magic item with provided ID',
                    monster: 'NotFound a monster with provided ID',
                    race: 'NotFound a race with provided ID',
                    realm: 'NotFound a realm with provided ID',
                    spell: 'NotFound a spell with provided ID',
                    system: 'NotFound a system with provided ID',
                    weapon: 'NotFound a weapon with provided ID',
                    wiki: 'NotFound a wiki with provided ID',
                },
                {
                    system: {
                        responseActive: (isActive: boolean) =>
                            `${isActive ? 'System already active' : 'System already deactivated'}`,
                        payloadActive: 'Not possible to change availability through this route',
                    },
                    default: {
                        responseActive: (query: boolean) =>
                            `${query ? 'Entity already enabled' : 'Entity already disabled'}`,
                        payloadActive: 'Not possible to change availability through this route',
                    },
                },
                'Update the content directly is not allowed',
                'An entity name is required',
            ];

            Object.values(errorMessage).forEach((errorMsg, index) => {
                expect(JSON.stringify(errorMsg).length).toBeGreaterThan(0);
                expect(JSON.stringify(errorMsg)).toBe(JSON.stringify(corretErrorMessages[index]));
            });
        });
    });
});
