import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { God } from 'src/schemas/godsValidationSchema';
import Mock from 'src/types/Mock';

const godInstanceEn: God = {
  name: 'Zeus',
  alignment: 'Neutral and Evil',
  suggestedDomains: 'Olympo',
  symbol: 'Lightning',
  phanteon: 'Greek'
};

const godInstancePt: God = {
  name: 'Zeus',
  alignment: 'Neutro e Mal',
  suggestedDomains: 'Olympo',
  symbol: 'Raio',
  phanteon: 'Grego'
};

const god: Mock = {
  instance: {
    _id: generateNewMongoID(),
    en: godInstanceEn,
    pt: godInstancePt
  },
  description: 'Mock an instance of a RPG god'
};

export default god;
