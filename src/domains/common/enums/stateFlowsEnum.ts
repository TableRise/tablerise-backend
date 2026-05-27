import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum stateFlowsEnum {
    NO_CURRENT_FLOW = 'no-current-flow',
    UPDATE_PASSWORD = 'update-password',
    CREATE_USER = 'create-user',
    ACTIVATE_SECRET_QUESTION = 'activate-secret-question',
    ACTIVATE_TWO_FACTOR = 'activate-two-factor',
    RESET_TWO_FACTOR = 'reset-two-factor',
    UPDATE_EMAIL = 'update-email',
    RESET_PROFILE = 'reset-profile',
    DELETE_USER = 'delete-user',
    DISABLE_TWO_FACTOR = 'disable-two-factor',
}

export default {
    enum: stateFlowsEnum,
    values: returnEnumValues(stateFlowsEnum),
};

export type stateFlowsKeys = stateFlowsEnum;
