import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { ISystem } from 'src/schemas/systemsValidationSchema';
import IMock from 'src/types/IMock';

const systemInstance: ISystem = {
  _id: generateNewMongoID(),
  name: '',
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
    monsters: [generateNewMongoID()]
  },
  references: {
    srd: '',
    icon: '',
    cover: ''
  },
  active: true
};

const SYSTEM_INSTANCE_MOCK: IMock = {
  instance: systemInstance,
  description: 'Mock an instance of a RPG system'
};

export default {
  SYSTEM_INSTANCE_MOCK
};
