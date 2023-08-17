const systemSeeder = require('./systemSeeder.json');
const realmsSeeder = require('./realmsSeeder.json');
const godsSeeder = require('./godsSeeder.json');
const featsSeeder = require('./featsSeeder.json');
const backgroundsSeeder = require('./backgroundsSeeder.json');
const racesSeeder = require('./racesSeeder.json');
const itemsSeeder = require('./itemsSeeder.json');
const weaponsSeeder = require('./weaponsSeeder.json');
const armorsSeeder = require('./armorsSeeder.json');
const classesSeeder = require('./classesSeeder.json');
const monstersSeeder = require('./monstersSeeder.json');
const spellsSeeder = require('./spellsSeeder.json');
const wikiSeeder = require('./wikiSeeder.json');
const magicItemsSeeder = require('./magicItemsSeeder.json');

module.exports = {
    system: systemSeeder,
    realms: realmsSeeder,
    gods: godsSeeder,
    feats: featsSeeder,
    backgrounds: backgroundsSeeder,
    races: racesSeeder,
    items: itemsSeeder,
    weapons: weaponsSeeder,
    armors: armorsSeeder,
    classes: classesSeeder,
    monsters: monstersSeeder,
    spells: spellsSeeder,
    wiki: wikiSeeder,
    magicItems: magicItemsSeeder,
};
