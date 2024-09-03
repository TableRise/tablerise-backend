import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum stateFlowsEnum {
    UPDATE_PASSWORD = 'update-password',
    CREATE_USER = 'create-user',
}

export default {
    enum: stateFlowsEnum,
    values: returnEnumValues(stateFlowsEnum),
};

export type stateFlowsKeys = stateFlowsEnum;
