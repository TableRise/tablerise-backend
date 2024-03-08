import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum systemsEnum {
    DUNGEONS_AND_DRAGONS_5E = 'dungeons-and-dragons-5e',
}

export default {
    enum: systemsEnum,
    values: returnEnumValues(systemsEnum),
};
