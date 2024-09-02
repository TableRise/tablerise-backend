import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum InProgressStatusEnum {
    WAIT_TO_CONFIRM = 'wait-to-confirm',
    WAIT_TO_COMPLETE = 'wait-to-complete',
    WAIT_TO_VERIFY = 'wait-to-verify',
    WAIT_TO_CHANGE_EMAIL = 'wait-to-change-email',
    WAIT_TO_START_PASSWORD_CHANGE = 'wait-to-start-password-change',
    WAIT_TO_FINISH_PASSWORD_CHANGE = 'wait-to-finish-password-change',
    WAIT_TO_DELETE_USER = 'wait-to-delete-user',
    WAIT_TO_SECRET_QUESTION  ='wait-to-secret-question',
    DONE = 'done',
}

export default {
    enum: InProgressStatusEnum,
    values: returnEnumValues(InProgressStatusEnum),
};

export type InProgressStatus = InProgressStatusEnum;
