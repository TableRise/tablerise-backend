import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { IRealm } from 'src/schemas/realmsValidationSchema';
import IMock from 'src/types/IMock';

const realmInstance: IRealm = {
  _id: generateNewMongoID(),
  name: 'Neverland',
  description: 'Uma terra linda e cheia de magia',
  thumbnail: 'http://neverland.com/picture.jpg'
};

const realm: IMock = {
  instance: realmInstance,
  description: 'Mock an instance of a RPG realm'
};

export default realm;
