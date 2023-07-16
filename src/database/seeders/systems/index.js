const systemSeeder = require('./systemSeeder.json');
const realmsSeeder = require('./realmsSeeder.json');
const godsSeeder = require('./godsSeeder.json');
const featsSeeder = require('./featsSeeder.json');
const backgroundsSeeder = require('./backgroundsSeeder.json');
const racesSeeder = require('./racesSeeder.json');
const itemsSeeder = require('./itemsSeeder.json');

module.exports = {
  system: systemSeeder,
  realms: realmsSeeder,
  gods: godsSeeder,
  feat: featsSeeder,
  backgrounds: backgroundsSeeder,
  races: racesSeeder,
  items: itemsSeeder
};
