import systemsMocks, { updateSystem } from 'src/support/mocks/systemsMocks';
import realmsMocks from 'src/support/mocks/realmsMocks';
import godsMocks from 'src/support/mocks/godsMocks';
import Mock from 'src/types/Mock';

export default {
  system: systemsMocks,
  updateSystemContent: updateSystem as Mock,
  realm: realmsMocks,
  god: godsMocks
}
