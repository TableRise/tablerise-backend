import systemRoutes from 'src/routes/systemRoutes';
import realmRoutes from 'src/routes/realmRoutes';
import godRoutes from 'src/routes/godRoutes';
import backgroundRoutes from 'src/routes/backgroundRoutes';
import featRoutes from 'src/routes/featRoutes';
import weaponRoutes from 'src/routes/weaponRoutes';
import armorRoutes from 'src/routes/armorRoutes';
import itemsRoutes from 'src/routes/itemsRoutes';
import racesRoutes from 'src/routes/racesRoutes';
import classRoutes from 'src/routes/classRoutes';
import magicItemRoutes from 'src/routes/magicItemsRoutes';
import spellRoutes from 'src/routes/spellRoutes';
import wikiRoutes from 'src/routes/wikiRoutes';
import monsterRoutes from 'src/routes/monsterRoutes';

import Route, { RouteWrapperDeclared } from 'src/types/Route';

import mocks from 'src/support/mocks';

import { System } from 'src/schemas/systemValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/realmsValidationSchema';
import { God } from 'src/schemas/godsValidationSchema';
import { Background } from 'src/schemas/backgroundsValidationSchema';
import { Feat } from 'src/schemas/featsValidationSchema';
import { Weapon } from 'src/schemas/weaponsValidationSchema';
import { Armor } from 'src/schemas/armorsValidationSchema';
import { Item } from 'src/schemas/itemsValidationSchema';
import { Race } from 'src/schemas/racesValidationSchema';
import { Class } from 'src/schemas/classesValidationSchema';
import { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import { Spell } from 'src/schemas/spellsValidationSchema';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import { Monster } from 'src/schemas/monstersValidationSchema';

import generateIDParam, { generateQueryParam } from './parametersWrapper';

const systemInstance = mocks.system.instance as System;
const { _id: _, content: __, ...systemWithoutContent } = systemInstance;
const updateSystemInstance = mocks.updateSystemContent;

const realmInstance = mocks.realm.instance as Internacional<Realm>;
const { _id: _1, ...realmWithoutId } = realmInstance;

const godInstance = mocks.god.instance as Internacional<God>;
const { _id: _2, ...godWithoutId } = godInstance;

const backgroundInstance = mocks.background.instance as Internacional<Background>;
const { _id: _3, ...backgroundWithoutId } = backgroundInstance;

const featInstance = mocks.feat.instance as Internacional<Feat>;
const { _id: _4, ...featWithoutId } = featInstance;

const weaponInstance = mocks.weapon.instance as Internacional<Weapon>;
const { _id: _5, ...weaponWithoutId } = weaponInstance;

const armorInstance = mocks.armor.instance as Internacional<Armor>;
const { _id: _6, ...armorWithoutId } = armorInstance;

const itemInstance = mocks.item.instance as Internacional<Item>;
const { _id: _7, ...itemWithoutId } = itemInstance;

const raceInstance = mocks.race.instance as Internacional<Race>;
const { _id: _8, ...raceWithoutId } = raceInstance;

const classInstance = mocks.class.instance as Internacional<Class>;
const { _id: _9, ...classWithoutId } = classInstance;

const magicItemInstance = mocks.magicItems.instance as Internacional<MagicItem>;
const { _id: _10, ...magicItemWithoutId } = magicItemInstance;

const spellInstance = mocks.spell.instance as Internacional<Spell>;
const { _id: _11, ...spellWithoutId } = spellInstance;

const wikiInstance = mocks.wiki.instance as Internacional<Wiki>;
const { _id: _12, ...wikiWithoutId } = wikiInstance;

const monsterInstance = mocks.monster.instance as Internacional<Monster>;
const { _id: _13, ...monsterWithoutId } = monsterInstance;

class RoutesWrapper {
    static routes(): Route {
        return {
            system: systemRoutes,
            realms: realmRoutes,
            gods: godRoutes,
            backgrounds: backgroundRoutes,
            feats: featRoutes,
            weapons: weaponRoutes,
            armors: armorRoutes,
            items: itemsRoutes,
            races: racesRoutes,
            classes: classRoutes,
            magicItems: magicItemRoutes,
            spells: spellRoutes,
            wikis: wikiRoutes,
            monsters: monsterRoutes,
        };
    }

    // prettier-ignore
    static declareRoutes(): RouteWrapperDeclared[][] {
    return [
      ['/system', 'system', 'get', null, systemInstance, null, false],
      ['/system/{_id}', 'system', 'get', generateIDParam(), systemInstance, null, false],
      ['/system/{_id}', 'system', 'put', generateIDParam(), systemInstance, systemWithoutContent, false],
      ['/system/{_id}', 'system', 'patch', [
        ...generateIDParam(),
        ...generateQueryParam(1, [{ name: 'entity', type: 'string' }])
      ], null, updateSystemInstance.instance, false],
      ['/system/activate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],
      ['/system/deactivate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],

      ['/realms', 'realms', 'get', null, realmInstance, null, false],
      ['/realms/{_id}', 'realms', 'get', generateIDParam(), realmInstance, null, false],
      ['/realms/{_id}', 'realms', 'put', generateIDParam(), realmInstance, realmWithoutId, false],
      ['/realms/{_id}', 'realms', 'delete', generateIDParam(), null, null, false],

      ['/gods', 'gods', 'get', null, godInstance, null, false],
      ['/gods/{_id}', 'gods', 'get', generateIDParam(), godInstance, null, false],
      ['/gods/{_id}', 'gods', 'put', generateIDParam(), godInstance, godWithoutId, false],
      ['/gods/{_id}', 'gods', 'delete', generateIDParam(), null, null, false],

      ['/backgrounds', 'backgrounds', 'get', null, backgroundInstance, null, false],
      ['/backgrounds/{_id}', 'backgrounds', 'get', generateIDParam(), backgroundInstance, null, false],
      ['/backgrounds/{_id}', 'backgrounds', 'put', generateIDParam(), backgroundInstance, backgroundWithoutId, false],
      ['/backgrounds/{_id}', 'backgrounds', 'delete', generateIDParam(), null, null, false],

      ['/feats', 'feats', 'get', null, featInstance, null, false],
      ['/feats/{_id}', 'feats', 'get', generateIDParam(), featInstance, null, false],
      ['/feats/{_id}', 'feats', 'put', generateIDParam(), featInstance, featWithoutId, false],
      ['/feats/{_id}', 'feats', 'delete', generateIDParam(), null, null, false],

      ['/weapons', 'weapons', 'get', null, weaponInstance, null, false],
      ['/weapons/{_id}', 'weapons', 'get', generateIDParam(), weaponInstance, null, false],
      ['/weapons/{_id}', 'weapons', 'put', generateIDParam(), weaponInstance, weaponWithoutId, false],
      ['/weapons/{_id}', 'weapons', 'delete', generateIDParam(), null, null, false],

      ['/armors', 'armors', 'get', null, armorInstance, null, false],
      ['/armors/{_id}', 'armors', 'get', generateIDParam(), armorInstance, null, false],
      ['/armors/{_id}', 'armors', 'put', generateIDParam(), armorInstance, armorWithoutId, false],
      ['/armors/{_id}', 'armors', 'delete', generateIDParam(), null, null, false],

      ['/items', 'items', 'get', null, itemInstance, null, false],
      ['/items/{_id}', 'items', 'get', generateIDParam(), itemInstance, null, false],
      ['/items/{_id}', 'items', 'put', generateIDParam(), itemInstance, itemWithoutId, false],
      ['/items/{_id}', 'items', 'delete', generateIDParam(), null, null, false],

      ['/races', 'races', 'get', null, raceInstance, null, false],
      ['/races/{_id}', 'races', 'get', generateIDParam(), raceInstance, null, false],
      ['/races/{_id}', 'races', 'put', generateIDParam(), raceInstance, raceWithoutId, false],
      ['/races/{_id}', 'races', 'delete', generateIDParam(), null, null, false],
      
      ['/classes', 'classes', 'get', null, classInstance, null, false],
      ['/classes/{_id}', 'classes', 'get', generateIDParam(), classInstance, null, false],
      ['/classes/{_id}', 'classes', 'put', generateIDParam(), classInstance, classWithoutId, false],
      ['/classes/{_id}', 'classes', 'patch', [
        ...generateIDParam(),
        ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])
      ], null, null, false],

      ['/magicItems', 'magicItems', 'get', null, magicItemInstance, null, false],
      ['/magicItems/{_id}', 'magicItems', 'get', generateIDParam(), magicItemInstance, null, false],
      ['/magicItems/{_id}', 'magicItems', 'put', generateIDParam(), magicItemInstance, magicItemWithoutId, false],
      ['/magicItems/{_id}', 'magicItems', 'delete', generateIDParam(), null, null, false],

      ['/spells', 'spells', 'get', null, spellInstance, null, false],
      ['/spells/{_id}', 'spells', 'get', generateIDParam(), spellInstance, null, false],
      ['/spells/{_id}', 'spells', 'put', generateIDParam(), spellInstance, spellWithoutId, false],
      ['/spells/{_id}', 'spells', 'patch', [
        ...generateIDParam(),
        ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])
      ], null, null, false],

      ['/wikis', 'wikis', 'get', null, wikiInstance, null, false],
      ['/wikis/{_id}', 'wikis', 'get', generateIDParam(), wikiInstance, null, false],
      ['/wikis/{_id}', 'wikis', 'put', generateIDParam(), wikiInstance, wikiWithoutId, false],
      ['/wikis/{_id}', 'wikis', 'delete', generateIDParam(), null, null, false],

      ['/monsters', 'monsters', 'get', null, monsterInstance, null, false],
      ['/monsters/{_id}', 'monsters', 'get', generateIDParam(), monsterInstance, null, false],
      ['/monsters/{_id}', 'monsters', 'put', generateIDParam(), monsterInstance, monsterWithoutId, false],
      ['/monsters/{_id}', 'monsters', 'delete', generateIDParam(), null, null, false]
    ];
  }
}

export default RoutesWrapper;
