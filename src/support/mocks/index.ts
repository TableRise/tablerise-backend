import backgroundMocks from 'src/support/mocks/backgroundsMocks';
import classMocks from 'src/support/mocks/classesMocks';
import featMocks from 'src/support/mocks/featsMocks';
import godsMocks from 'src/support/mocks/godsMocks';
import itemsMocks from 'src/support/mocks/itemsMocks';
import Mock from 'src/types/Mock';
import racesMocks from 'src/support/mocks/racesMocks';
import realmsMocks from 'src/support/mocks/realmsMocks';
import spellMocks from 'src/support/mocks/spellsMocks';
import systemsMocks, { updateSystem } from 'src/support/mocks/systemsMocks';

export default {
  background: backgroundMocks,
  class: classMocks,
  feat: featMocks,
  god: godsMocks,
  item: itemsMocks,
  race: racesMocks,
  realm: realmsMocks,
  spell: spellMocks,
  system: systemsMocks,
  updateSystemContent: updateSystem as Mock
}
