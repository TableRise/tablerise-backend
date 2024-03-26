import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum visibilityEnum {
    HIDDEN = 'hidden',
    VISIBLE = 'visible',
}

export default {
    enum: visibilityEnum,
    values: returnEnumValues(visibilityEnum),
};
