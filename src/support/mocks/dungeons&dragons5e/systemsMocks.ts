import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import Mock from 'src/types/Mock';
import { UpdateContent } from 'src/schemas/updateContentSchema';

const systemInstance: System = {
    name: 'Tormenta',
    content: {
        races: [generateNewMongoID()],
        classes: [generateNewMongoID()],
        spells: [generateNewMongoID()],
        items: [generateNewMongoID()],
        weapons: [generateNewMongoID()],
        armors: [generateNewMongoID()],
        feats: [generateNewMongoID()],
        realms: [generateNewMongoID()],
        gods: [generateNewMongoID()],
        monsters: [generateNewMongoID()],
    },
    references: {
        srd: 'http://tormenta20.com.br',
        icon: 'http://tormenta20.com.br/icon/550.jpg',
        cover: 'http://tormenta20.com.br/cover/2100.jpg',
    },
    active: true,
};

const updateSystemContentInstance: UpdateContent = {
    method: 'add',
    newID: generateNewMongoID(),
};

const system: Mock = {
    instance: {
        _id: generateNewMongoID(),
        ...systemInstance,
    },
    description: 'Mock an instance of a RPG system',
};

export const updateSystem = {
    instance: updateSystemContentInstance,
    description: 'Mock an instance of a RPG system updating of a content',
};

export default system;
