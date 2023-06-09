import systemsMocks, { updateSystem } from 'src/support/mocks/systemsMocks';
import realmsMocks from 'src/support/mocks/realmsMocks';
import godsMocks from 'src/support/mocks/godsMocks';
import backgroundMocks from 'src/support/mocks/backgroundsMocks';
import featMocks from 'src/support/mocks/featsMocks';
import Mock from 'src/types/Mock';

export default {
  system: systemsMocks,
  updateSystemContent: updateSystem as Mock,
  realm: realmsMocks,
  god: godsMocks,
  background: backgroundMocks,
  feat: featMocks
}
