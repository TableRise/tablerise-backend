import generateNewMongoID from 'src/helpers/generateNewMongoID';
import { ISystem } from 'src/schemas/systemValidationSchema';

const SYSTEM_INSTANCE_MOCK: ISystem = {
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

export default {
  SYSTEM_INSTANCE_MOCK
};
