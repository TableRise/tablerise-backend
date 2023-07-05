import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { God } from 'src/schemas/godsValidationSchema';
import Mock from 'src/types/Mock';

const godInstance: God = {
  _id: generateNewMongoID(),
  name: 'Zeus',
  alignment: 'Neutro e Mal',
  suggestedDomains: 'Olympo',
  symbol: 'Raio',
  phanteon: 'Grego'
};

const god: Mock = {
  instance: godInstance,
  description: 'Mock an instance of a RPG god'
};

export default god;
