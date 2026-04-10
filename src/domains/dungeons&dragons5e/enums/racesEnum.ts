import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum racesEnum {
    DWARF = 'Dwarf',
    ELF = 'Elf',
    HALFLING = 'Halfling',
    HUMAN = 'Human',
    DRAGONBORN = 'Dragonborn',
    GNOME = 'Gnome',
    HALF_ELF = 'Half-elf',
    HALF_ORC = 'Half-orc',
    TIEFLING = 'Tiefling',
}

export default {
    enum: racesEnum,
    values: returnEnumValues(racesEnum),
};
