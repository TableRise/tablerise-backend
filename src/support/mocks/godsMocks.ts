import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { IGod } from 'src/schemas/godsValidationSchema';
import IMock from 'src/types/IMock';

const godInstance: IGod = {
  _id: generateNewMongoID(),
  name: 'Zeus',
  alignment: 'Neutro e Mal',
  suggestedDomains: 'Olympo',
  symbol: 'Raio',
  phanteon: 'Grego'
};

const god: IMock = {
  instance: godInstance,
  description: 'Mock an instance of a RPG god'
};

export default god;
