/* eslint-disable no-console */
import Seeder from 'src/support/helpers/SeederMachine';
import systemJSON from './systems/systemsSeeder.json';

const seederMachine = new Seeder('dev');

seederMachine.systems(systemJSON)
  .then(() => { console.log('Database seeded') })
  .catch(() => { throw new Error('Database seed failed') });
