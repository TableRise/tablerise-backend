import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const itemMockEn: Item = {
  name: 'History of Valley',
  description: 'contains maps od the valley',
  cost: {
    currency: 'sp',
    value: 25
  },
  type: 'adventuring gear',
  weight: 5,
  mountOrVehicle: {
    isValid: false,
    speed: '2',
    carryingCapacity: '3'
  },
  tradeGoods: {
    isValid: false,
    goods: '3'
  }
};

const itemMockPt: Item = {
  name: 'História do Vale',
  description: 'contém todos os mapas do vale',
  cost: {
    currency: 'po',
    value: 25
  },
  type: 'item de aventura',
  weight: 5,
  mountOrVehicle: {
    isValid: false,
    speed: '2',
    carryingCapacity: '3'
  },
  tradeGoods: {
    isValid: false,
    goods: '3'
  }
};

const itemsMocks: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: itemMockEn,
        pt: itemMockPt,
    },
    description: 'Mock an instance of Item',
};

export default itemsMocks;
