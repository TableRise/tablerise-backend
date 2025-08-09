import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum classesEnum {
    BARBARIAN = 'Barbarian',
    BARD = 'Bard',
    CLERIC = 'Cleric',
    DRUID = 'Druid',
    FIGHTER = 'Fighter',
    MONK = 'Monk',
    PALADIN = 'Paladin',
    RANGER = 'Ranger',
    ROGUE = 'Rogue',
    SORCERER = 'Sorcerer',
    WARLOCK = 'Warlock',
    WIZARD = 'Wizard',
}

export default {
    enum: classesEnum,
    values: returnEnumValues(classesEnum),
};
