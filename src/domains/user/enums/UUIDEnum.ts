import returnEnumValues from 'src/infra/helpers/common/returnEnumValues';

enum UUIDEnum {
    isValid = '/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i',
}

export default {
    enum: UUIDEnum,
    values: returnEnumValues(UUIDEnum),
};
