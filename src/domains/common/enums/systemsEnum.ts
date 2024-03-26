import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum systemsEnum {
    DND5E = 'dnd5e',
}

export default {
    enum: systemsEnum,
    values: returnEnumValues(systemsEnum),
};
