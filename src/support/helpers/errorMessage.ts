export const errorMessage = {
    notFound: {
        armor: 'NotFound an armor with provided ID',
        background: 'NotFound a background with provided ID',
        classe: 'NotFound a classe with provided ID',
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
    badRequest: {
        system: {
            responseActive: (isActive: boolean) => `${isActive ?'System already active' : 'System already deactivated'}`,
            payloadActive: 'Not possible to change availability through this route',
        },
        default: {
            responseActive: (query: boolean) => `${query ? 'Entity already enabled' : 'Entity already disabled'}`,
            payloadActive: 'Not possible to change availability through this route',
        },
    },
    forbidden: 'Update the content directly is not allowed',
    unprocessableEntity: 'An entity name is required',
};
