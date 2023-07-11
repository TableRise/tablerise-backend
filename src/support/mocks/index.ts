import backgroundMocks from 'src/support/mocks/backgroundsMocks';
import featMocks from 'src/support/mocks/featsMocks';
import godsMocks from 'src/support/mocks/godsMocks';
import itensMocks from 'src/support/mocks/itensMocks';
import racesMocks from 'src/support/mocks/racesMocks';
import realmsMocks from 'src/support/mocks/realmsMocks';
import systemsMocks, { updateSystem } from 'src/support/mocks/systemsMocks';

import Mock from 'src/types/Mock';

export default {
  background: backgroundMocks,
  feat: featMocks,
  god: godsMocks,
  item: itensMocks,
  race: racesMocks,
  realm: realmsMocks,
  system: systemsMocks,
  updateSystemContent: updateSystem as Mock

}
