const systemSeeder = require('./systemSeeder.json');
const featsSeeder = require('./featsSeeder.json');
const racesSeeder = require('./racesSeeder.json');
const classesSeeder = require('./classesSeeder.json');
const spellsSeeder = require('./spellsSeeder.json');
const equipmentSeeder = require('./equipmentSeeder.json');

module.exports = {
    System: systemSeeder,
    Feats: featsSeeder,
    Races: racesSeeder,
    Classes: classesSeeder,
    Spells: spellsSeeder,
    Equipment: equipmentSeeder,
};
