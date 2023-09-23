import mocks from 'src/support/mocks/dungeons&dragons5e';
import { routeOriginal } from '@tablerise/auto-swagger';

import generateIDParam, { generateQueryParam } from 'src/routes/parametersWrapper';
import { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { MagicItem } from 'src/schemas/dungeons&dragons5e/magicItemsValidationSchema';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import { Spell } from 'src/schemas/dungeons&dragons5e/spellsValidationSchema';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import { Wiki } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

const systemInstance = mocks.system.instance as System & { _id: string };
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

export default [
    ['/dnd5e/system', 'system', 'get', null, null, false],
    ['/dnd5e/system/{_id}', 'system', 'get', generateIDParam(), null, false],
    ['/dnd5e/system/{_id}', 'system', 'put', generateIDParam(), systemWithoutContent, false],
    [
        '/dnd5e/system/content/{_id}',
        'system',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'entity', type: 'string' }])],
        updateSystemInstance.instance,
        false,
    ],
    [
        '/dnd5e/system/{_id}',
        'system',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/realms', 'realms', 'get', null, null, false],
    ['/dnd5e/realms/disabled', 'realms', 'get', null, null, false],
    ['/dnd5e/realms/{_id}', 'realms', 'get', generateIDParam(), null, false],
    ['/dnd5e/realms/{_id}', 'realms', 'put', generateIDParam(), realmWithoutId, false],
    [
        '/dnd5e/realms/{_id}',
        'realms',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/gods', 'gods', 'get', null, null, false],
    ['/dnd5e/gods/disabled', 'gods', 'get', null, null, false],
    ['/dnd5e/gods/{_id}', 'gods', 'get', generateIDParam(), null, false],
    ['/dnd5e/gods/{_id}', 'gods', 'put', generateIDParam(), godWithoutId, false],
    [
        '/dnd5e/gods/{_id}',
        'gods',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/backgrounds', 'backgrounds', 'get', null, null, false],
    ['/dnd5e/backgrounds/disabled', 'backgrounds', 'get', null, null, false],
    ['/dnd5e/backgrounds/{_id}', 'backgrounds', 'get', generateIDParam(), null, false],
    ['/dnd5e/backgrounds/{_id}', 'backgrounds', 'put', generateIDParam(), backgroundWithoutId, false],
    [
        '/dnd5e/backgrounds/{_id}',
        'backgrounds',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/feats', 'feats', 'get', null, null, false],
    ['/dnd5e/feats/disabled', 'feats', 'get', null, null, false],
    ['/dnd5e/feats/{_id}', 'feats', 'get', generateIDParam(), null, false],
    ['/dnd5e/feats/{_id}', 'feats', 'put', generateIDParam(), featWithoutId, false],
    [
        '/dnd5e/feats/{_id}',
        'feats',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/weapons', 'weapons', 'get', null, null, false],
    ['/dnd5e/weapons/disabled', 'weapons', 'get', null, null, false],
    ['/dnd5e/weapons/{_id}', 'weapons', 'get', generateIDParam(), null, false],
    ['/dnd5e/weapons/{_id}', 'weapons', 'put', generateIDParam(), weaponWithoutId, false],
    [
        '/dnd5e/weapons/{_id}',
        'weapons',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/armors', 'armors', 'get', null, null, false],
    ['/dnd5e/armors/disabled', 'armors', 'get', null, null, false],
    ['/dnd5e/armors/{_id}', 'armors', 'get', generateIDParam(), null, false],
    ['/dnd5e/armors/{_id}', 'armors', 'put', generateIDParam(), armorWithoutId, false],
    [
        '/dnd5e/armors/{_id}',
        'armors',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/items', 'items', 'get', null, null, false],
    ['/dnd5e/items/disabled', 'items', 'get', null, null, false],
    ['/dnd5e/items/{_id}', 'items', 'get', generateIDParam(), null, false],
    ['/dnd5e/items/{_id}', 'items', 'put', generateIDParam(), itemWithoutId, false],
    [
        '/dnd5e/items/{_id}',
        'items',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/races', 'races', 'get', null, null, false],
    ['/dnd5e/races/disabled', 'races', 'get', null, null, false],
    ['/dnd5e/races/{_id}', 'races', 'get', generateIDParam(), null, false],
    ['/dnd5e/races/{_id}', 'races', 'put', generateIDParam(), raceWithoutId, false],
    [
        '/dnd5e/races/{_id}',
        'races',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/classes', 'classes', 'get', null, null, false],
    ['/dnd5e/classes/disabled', 'classes', 'get', null, null, false],
    ['/dnd5e/classes/{_id}', 'classes', 'get', generateIDParam(), null, false],
    ['/dnd5e/classes/{_id}', 'classes', 'put', generateIDParam(), classWithoutId, false],
    [
        '/dnd5e/classes/{_id}',
        'classes',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/magicItems', 'magicItems', 'get', null, null, false],
    ['/dnd5e/magicItems/disabled', 'magicItems', 'get', null, null, false],
    ['/dnd5e/magicItems/{_id}', 'magicItems', 'get', generateIDParam(), null, false],
    ['/dnd5e/magicItems/{_id}', 'magicItems', 'put', generateIDParam(), magicItemWithoutId, false],
    [
        '/dnd5e/magicItems/{_id}',
        'magicItems',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/spells', 'spells', 'get', null, null, false],
    ['/dnd5e/spells/disabled', 'spells', 'get', null, null, false],
    ['/dnd5e/spells/{_id}', 'spells', 'get', generateIDParam(), null, false],
    ['/dnd5e/spells/{_id}', 'spells', 'put', generateIDParam(), spellWithoutId, false],
    [
        '/dnd5e/spells/{_id}',
        'spells',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/wikis', 'wikis', 'get', null, null, false],
    ['/dnd5e/wikis/disabled', 'wikis', 'get', null, null, false],
    ['/dnd5e/wikis/{_id}', 'wikis', 'get', generateIDParam(), null, false],
    ['/dnd5e/wikis/{_id}', 'wikis', 'put', generateIDParam(), wikiWithoutId, false],
    [
        '/dnd5e/wikis/{_id}',
        'wikis',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],

    ['/dnd5e/monsters', 'monsters', 'get', null, null, false],
    ['/dnd5e/monsters/disabled', 'monsters', 'get', null, null, false],
    ['/dnd5e/monsters/{_id}', 'monsters', 'get', generateIDParam(), null, false],
    ['/dnd5e/monsters/{_id}', 'monsters', 'put', generateIDParam(), monsterWithoutId, false],
    [
        '/dnd5e/monsters/{_id}',
        'monsters',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        false,
    ],
] as routeOriginal;
