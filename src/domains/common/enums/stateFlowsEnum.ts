import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum stateFlowsEnum {
    UPDATE_PASSWORD = 'update-password',
}

export default {
    enum: stateFlowsEnum,
    values: returnEnumValues(stateFlowsEnum),
};
