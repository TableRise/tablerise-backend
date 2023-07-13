import { Armor } from './../../schemas/armorsValidationSchema';
import generateNewMongoID from '../helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const armorMockEn: Armor = {
  type: 'Light Armor',
  name: 'Padded',
  description: 'A simple padded',
  cost: {
    currency: 'gp',
    value: 5
  },
  weight: 8,
  armorClass: 11,
  requiredStrength: 0,
  stealthPenalty: true
};

const armorMockPt: Armor = {
  type: 'Armadura Leve',
  name: 'Acolchoada',
  description: 'Uma simples armadura acolchoada',
  cost: {
    currency: 'gp',
    value: 5
  },
  weight: 8,
  armorClass: 11,
  requiredStrength: 0,
  stealthPenalty: true
};

const armor: Mock = {
  instance: {
    _id: generateNewMongoID(),
    en: armorMockEn,
    pt: armorMockPt
  },
  description: 'Mock an instance of a RPG armor'
}

export default armor;
