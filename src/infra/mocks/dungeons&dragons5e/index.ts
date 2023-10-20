import backgroundMocks from 'src/infra/mocks/dungeons&dragons5e/backgroundsMocks';
import classMocks from 'src/infra/mocks/dungeons&dragons5e/classesMocks';
import featMocks from 'src/infra/mocks/dungeons&dragons5e/featsMocks';
import godsMocks from 'src/infra/mocks/dungeons&dragons5e/godsMocks';
import itemsMocks from 'src/infra/mocks/dungeons&dragons5e/itemsMocks';
import Mock from 'src/types/Mock';
import racesMocks from 'src/infra/mocks/dungeons&dragons5e/racesMocks';
import realmsMocks from 'src/infra/mocks/dungeons&dragons5e/realmsMocks';
import spellMocks from 'src/infra/mocks/dungeons&dragons5e/spellsMocks';
import weaponMocks from 'src/infra/mocks/dungeons&dragons5e/weaponsMocks';
import armorMocks from 'src/infra/mocks/dungeons&dragons5e/armorsMocks';
import systemsMocks, { updateSystem } from 'src/infra/mocks/dungeons&dragons5e/systemsMocks';
import monstersMocks from 'src/infra/mocks/dungeons&dragons5e/monstersMocks';
import wikisMocks from 'src/infra/mocks/dungeons&dragons5e/wikisMocks';
import magicItemsMocks from 'src/infra/mocks/dungeons&dragons5e/magicItemsMocks';

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
    weapon: weaponMocks,
    armor: armorMocks,
    monster: monstersMocks,
    wiki: wikisMocks,
    magicItems: magicItemsMocks,
    updateSystemContent: updateSystem as Mock,
};
