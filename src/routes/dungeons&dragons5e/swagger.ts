import mocks from 'src/support/mocks/dungeons&dragons5e';

import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import { MagicItem } from 'src/schemas/dungeons&dragons5e/magicItemsValidationSchema';
import { Spell } from 'src/schemas/dungeons&dragons5e/spellsValidationSchema';
import { Wiki } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';

import generateIDParam, { generateQueryParam } from 'src/routes/parametersWrapper';

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

export default [
    ['/system', 'system', 'get', null, systemInstance, null, false],
        ['/system/{_id}', 'system', 'get', generateIDParam(), systemInstance, null, false],
        ['/system/{_id}', 'system', 'put', generateIDParam(), systemInstance, systemWithoutContent, false],
        [
            '/system/{_id}',
            'system',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'entity', type: 'string' }])],
            null,
            updateSystemInstance.instance,
            false
        ],
        ['/system/activate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],
        ['/system/deactivate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],

        ['/realms', 'realms', 'get', null, realmInstance, null, false],
        ['/realms/disabled', 'realms', 'get', null, itemInstance, null, false],
        ['/realms/{_id}', 'realms', 'get', generateIDParam(), realmInstance, null, false],
        ['/realms/{_id}', 'realms', 'put', generateIDParam(), realmInstance, realmWithoutId, false],
        [
            '/realms/{_id}',
            'realms',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/gods', 'gods', 'get', null, godInstance, null, false],
        ['/gods/disabled', 'gods', 'get', null, itemInstance, null, false],
        ['/gods/{_id}', 'gods', 'get', generateIDParam(), godInstance, null, false],
        ['/gods/{_id}', 'gods', 'put', generateIDParam(), godInstance, godWithoutId, false],
        [
            '/gods/{_id}',
            'gods',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/backgrounds', 'backgrounds', 'get', null, backgroundInstance, null, false],
        ['/backgrounds/disabled', 'backgrounds', 'get', null, backgroundInstance, null, false],
        ['/backgrounds/{_id}', 'backgrounds', 'get', generateIDParam(), backgroundInstance, null, false],
        ['/backgrounds/{_id}', 'backgrounds', 'put', generateIDParam(), backgroundInstance, backgroundWithoutId, false],
        [
            '/backgrounds/{_id}',
            'backgrounds',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/feats', 'feats', 'get', null, featInstance, null, false],
        ['/feats/disabled', 'feats', 'get', null, featInstance, null, false],
        ['/feats/{_id}', 'feats', 'get', generateIDParam(), featInstance, null, false],
        ['/feats/{_id}', 'feats', 'put', generateIDParam(), featInstance, featWithoutId, false],
        [
            '/feats/{_id}',
            'feats',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/weapons', 'weapons', 'get', null, weaponInstance, null, false],
        ['/weapons/disabled', 'weapons', 'get', null, weaponInstance, null, false],
        ['/weapons/{_id}', 'weapons', 'get', generateIDParam(), weaponInstance, null, false],
        ['/weapons/{_id}', 'weapons', 'put', generateIDParam(), weaponInstance, weaponWithoutId, false],
        [
            '/weapons/{_id}',
            'weapons',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/armors', 'armors', 'get', null, armorInstance, null, false],
        ['/armors/disabled', 'armors', 'get', null, armorInstance, null, false],
        ['/armors/{_id}', 'armors', 'get', generateIDParam(), armorInstance, null, false],
        ['/armors/{_id}', 'armors', 'put', generateIDParam(), armorInstance, armorWithoutId, false],
        [
            '/armors/{_id}',
            'armors',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/items', 'items', 'get', null, itemInstance, null, false],
        ['/items/disabled', 'items', 'get', null, itemInstance, null, false],
        ['/items/{_id}', 'items', 'get', generateIDParam(), itemInstance, null, false],
        ['/items/{_id}', 'items', 'put', generateIDParam(), itemInstance, itemWithoutId, false],
        [
            '/items/{_id}',
            'items',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/races', 'races', 'get', null, raceInstance, null, false],
        ['/races/disabled', 'races', 'get', null, raceInstance, null, false],
        ['/races/{_id}', 'races', 'get', generateIDParam(), raceInstance, null, false],
        ['/races/{_id}', 'races', 'put', generateIDParam(), raceInstance, raceWithoutId, false],
        [
            '/races/{_id}',
            'races',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/classes', 'classes', 'get', null, classInstance, null, false],
        ['/classes/disabled', 'classes', 'get', null, classInstance, null, false],
        ['/classes/{_id}', 'classes', 'get', generateIDParam(), classInstance, null, false],
        ['/classes/{_id}', 'classes', 'put', generateIDParam(), classInstance, classWithoutId, false],
        [
            '/classes/{_id}',
            'classes',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/magicItems', 'magicItems', 'get', null, magicItemInstance, null, false],
        ['/magicItems/disabled', 'magicItems', 'get', null, magicItemInstance, null, false],
        ['/magicItems/{_id}', 'magicItems', 'get', generateIDParam(), magicItemInstance, null, false],
        ['/magicItems/{_id}', 'magicItems', 'put', generateIDParam(), magicItemInstance, magicItemWithoutId, false],
        [
            '/magicItems/{_id}',
            'magicItems',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/spells', 'spells', 'get', null, spellInstance, null, false],
        ['/spells/disabled', 'spells', 'get', null, spellInstance, null, false],
        ['/spells/{_id}', 'spells', 'get', generateIDParam(), spellInstance, null, false],
        ['/spells/{_id}', 'spells', 'put', generateIDParam(), spellInstance, spellWithoutId, false],
        [
            '/spells/{_id}',
            'spells',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/wikis', 'wikis', 'get', null, wikiInstance, null, false],
        ['/wikis/disabled', 'wikis', 'get', null, wikiInstance, null, false],
        ['/wikis/{_id}', 'wikis', 'get', generateIDParam(), wikiInstance, null, false],
        ['/wikis/{_id}', 'wikis', 'put', generateIDParam(), wikiInstance, wikiWithoutId, false],
        [
            '/wikis/{_id}',
            'wikis',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],

        ['/monsters', 'monsters', 'get', null, monsterInstance, null, false],
        ['/monsters/disabled', 'monsters', 'get', null, monsterInstance, null, false],
        ['/monsters/{_id}', 'monsters', 'get', generateIDParam(), monsterInstance, null, false],
        ['/monsters/{_id}', 'monsters', 'put', generateIDParam(), monsterInstance, monsterWithoutId, false],
        [
            '/monsters/{_id}',
            'monsters',
            'patch',
            [...generateIDParam(), ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }])],
            null,
            null,
            false
        ],
]