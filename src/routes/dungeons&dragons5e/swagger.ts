import {
    DnDSystem,
    Internacional,
    DnDRealm,
    DnDGod,
    DnDBackground,
    DnDFeat,
    DnDWeapon,
    DnDArmor,
    DnDItem,
    DnDRace,
    DnDClass,
    DnDMagicItem,
    DnDSpell,
    DnDWiki,
    DnDMonster
} from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';

import generateIDParam, { generateQueryParam } from 'src/routes/parametersWrapper';

const systemInstance = mocks.system.instance as DnDSystem & { _id: string };
const { _id: _, content: __, ...systemWithoutContent } = systemInstance;
const updateSystemInstance = mocks.updateSystemContent;

const realmInstance = mocks.realm.instance as Internacional<DnDRealm>;
const { _id: _1, ...realmWithoutId } = realmInstance;

const godInstance = mocks.god.instance as Internacional<DnDGod>;
const { _id: _2, ...godWithoutId } = godInstance;

const backgroundInstance = mocks.background.instance as Internacional<DnDBackground>;
const { _id: _3, ...backgroundWithoutId } = backgroundInstance;

const featInstance = mocks.feat.instance as Internacional<DnDFeat>;
const { _id: _4, ...featWithoutId } = featInstance;

const weaponInstance = mocks.weapon.instance as Internacional<DnDWeapon>;
const { _id: _5, ...weaponWithoutId } = weaponInstance;

const armorInstance = mocks.armor.instance as Internacional<DnDArmor>;
const { _id: _6, ...armorWithoutId } = armorInstance;

const itemInstance = mocks.item.instance as Internacional<DnDItem>;
const { _id: _7, ...itemWithoutId } = itemInstance;

const raceInstance = mocks.race.instance as Internacional<DnDRace>;
const { _id: _8, ...raceWithoutId } = raceInstance;

const classInstance = mocks.class.instance as Internacional<DnDClass>;
const { _id: _9, ...classWithoutId } = classInstance;

const magicItemInstance = mocks.magicItems.instance as Internacional<DnDMagicItem>;
const { _id: _10, ...magicItemWithoutId } = magicItemInstance;

const spellInstance = mocks.spell.instance as Internacional<DnDSpell>;
const { _id: _11, ...spellWithoutId } = spellInstance;

const wikiInstance = mocks.wiki.instance as Internacional<DnDWiki>;
const { _id: _12, ...wikiWithoutId } = wikiInstance;

const monsterInstance = mocks.monster.instance as Internacional<DnDMonster>;
const { _id: _13, ...monsterWithoutId } = monsterInstance;

export default [
    ['/dnd5e/system', 'system', 'get', null, systemInstance, null, false],
    ['/dnd5e/system/{_id}', 'system', 'get', generateIDParam(), systemInstance, null, false],
    ['/dnd5e/system/{_id}', 'system', 'put', generateIDParam(), systemInstance, systemWithoutContent, false],
    [
        '/dnd5e/system/{_id}',
        'system',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'entity', type: 'string' }])],
        null,
        updateSystemInstance.instance,
        false,
    ],
    ['/dnd5e/system/activate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],
    ['/dnd5e/system/deactivate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],

    ['/dnd5e/realms', 'realms', 'get', null, realmInstance, null, false],
    ['/dnd5e/realms/disabled', 'realms', 'get', null, itemInstance, null, false],
    ['/dnd5e/realms/{_id}', 'realms', 'get', generateIDParam(), realmInstance, null, false],
    ['/dnd5e/realms/{_id}', 'realms', 'put', generateIDParam(), realmInstance, realmWithoutId, false],
    [
        '/dnd5e/realms/{_id}',
        'realms',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/gods', 'gods', 'get', null, godInstance, null, false],
    ['/dnd5e/gods/disabled', 'gods', 'get', null, itemInstance, null, false],
    ['/dnd5e/gods/{_id}', 'gods', 'get', generateIDParam(), godInstance, null, false],
    ['/dnd5e/gods/{_id}', 'gods', 'put', generateIDParam(), godInstance, godWithoutId, false],
    [
        '/dnd5e/gods/{_id}',
        'gods',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/backgrounds', 'backgrounds', 'get', null, backgroundInstance, null, false],
    ['/dnd5e/backgrounds/disabled', 'backgrounds', 'get', null, backgroundInstance, null, false],
    ['/dnd5e/backgrounds/{_id}', 'backgrounds', 'get', generateIDParam(), backgroundInstance, null, false],
    [
        '/dnd5e/backgrounds/{_id}',
        'backgrounds',
        'put',
        generateIDParam(),
        backgroundInstance,
        backgroundWithoutId,
        false,
    ],
    [
        '/dnd5e/backgrounds/{_id}',
        'backgrounds',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/feats', 'feats', 'get', null, featInstance, null, false],
    ['/dnd5e/feats/disabled', 'feats', 'get', null, featInstance, null, false],
    ['/dnd5e/feats/{_id}', 'feats', 'get', generateIDParam(), featInstance, null, false],
    ['/dnd5e/feats/{_id}', 'feats', 'put', generateIDParam(), featInstance, featWithoutId, false],
    [
        '/dnd5e/feats/{_id}',
        'feats',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/weapons', 'weapons', 'get', null, weaponInstance, null, false],
    ['/dnd5e/weapons/disabled', 'weapons', 'get', null, weaponInstance, null, false],
    ['/dnd5e/weapons/{_id}', 'weapons', 'get', generateIDParam(), weaponInstance, null, false],
    ['/dnd5e/weapons/{_id}', 'weapons', 'put', generateIDParam(), weaponInstance, weaponWithoutId, false],
    [
        '/dnd5e/weapons/{_id}',
        'weapons',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/armors', 'armors', 'get', null, armorInstance, null, false],
    ['/dnd5e/armors/disabled', 'armors', 'get', null, armorInstance, null, false],
    ['/dnd5e/armors/{_id}', 'armors', 'get', generateIDParam(), armorInstance, null, false],
    ['/dnd5e/armors/{_id}', 'armors', 'put', generateIDParam(), armorInstance, armorWithoutId, false],
    [
        '/dnd5e/armors/{_id}',
        'armors',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/items', 'items', 'get', null, itemInstance, null, false],
    ['/dnd5e/items/disabled', 'items', 'get', null, itemInstance, null, false],
    ['/dnd5e/items/{_id}', 'items', 'get', generateIDParam(), itemInstance, null, false],
    ['/dnd5e/items/{_id}', 'items', 'put', generateIDParam(), itemInstance, itemWithoutId, false],
    [
        '/dnd5e/items/{_id}',
        'items',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/races', 'races', 'get', null, raceInstance, null, false],
    ['/dnd5e/races/disabled', 'races', 'get', null, raceInstance, null, false],
    ['/dnd5e/races/{_id}', 'races', 'get', generateIDParam(), raceInstance, null, false],
    ['/dnd5e/races/{_id}', 'races', 'put', generateIDParam(), raceInstance, raceWithoutId, false],
    [
        '/dnd5e/races/{_id}',
        'races',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/classes', 'classes', 'get', null, classInstance, null, false],
    ['/dnd5e/classes/disabled', 'classes', 'get', null, classInstance, null, false],
    ['/dnd5e/classes/{_id}', 'classes', 'get', generateIDParam(), classInstance, null, false],
    ['/dnd5e/classes/{_id}', 'classes', 'put', generateIDParam(), classInstance, classWithoutId, false],
    [
        '/dnd5e/classes/{_id}',
        'classes',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/magicItems', 'magicItems', 'get', null, magicItemInstance, null, false],
    ['/dnd5e/magicItems/disabled', 'magicItems', 'get', null, magicItemInstance, null, false],
    ['/dnd5e/magicItems/{_id}', 'magicItems', 'get', generateIDParam(), magicItemInstance, null, false],
    ['/dnd5e/magicItems/{_id}', 'magicItems', 'put', generateIDParam(), magicItemInstance, magicItemWithoutId, false],
    [
        '/dnd5e/magicItems/{_id}',
        'magicItems',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/spells', 'spells', 'get', null, spellInstance, null, false],
    ['/dnd5e/spells/disabled', 'spells', 'get', null, spellInstance, null, false],
    ['/dnd5e/spells/{_id}', 'spells', 'get', generateIDParam(), spellInstance, null, false],
    ['/dnd5e/spells/{_id}', 'spells', 'put', generateIDParam(), spellInstance, spellWithoutId, false],
    [
        '/dnd5e/spells/{_id}',
        'spells',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/wikis', 'wikis', 'get', null, wikiInstance, null, false],
    ['/dnd5e/wikis/disabled', 'wikis', 'get', null, wikiInstance, null, false],
    ['/dnd5e/wikis/{_id}', 'wikis', 'get', generateIDParam(), wikiInstance, null, false],
    ['/dnd5e/wikis/{_id}', 'wikis', 'put', generateIDParam(), wikiInstance, wikiWithoutId, false],
    [
        '/dnd5e/wikis/{_id}',
        'wikis',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],

    ['/dnd5e/monsters', 'monsters', 'get', null, monsterInstance, null, false],
    ['/dnd5e/monsters/disabled', 'monsters', 'get', null, monsterInstance, null, false],
    ['/dnd5e/monsters/{_id}', 'monsters', 'get', generateIDParam(), monsterInstance, null, false],
    ['/dnd5e/monsters/{_id}', 'monsters', 'put', generateIDParam(), monsterInstance, monsterWithoutId, false],
    [
        '/dnd5e/monsters/{_id}',
        'monsters',
        'patch',
        [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
        null,
        null,
        false,
    ],
];
