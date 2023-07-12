import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { Item } from 'src/schemas/itemsValidationSchema';
import Mock from 'src/types/Mock';

const itemMockEn: Item = {
  name: 'History of Valley',
  description: 'contains maps od the valley',
  cost: 25,
  type: 'adventuring gear',
  weight: 5
};

const itemMockPt: Item = {
  name: 'História do Vale',
  description: 'contém todos os mapas do vale',
  cost: 25,
  type: 'item de aventura',
  weight: 5
};

const itemsMocks: Mock = {
  instance: {
    _id: generateNewMongoID(),
    en: itemMockEn,
    pt: itemMockPt
  },
  description: 'Mock an instance of Item'
};

export default itemsMocks;
