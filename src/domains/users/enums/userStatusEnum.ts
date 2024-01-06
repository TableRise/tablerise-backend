import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum InProgressStatusEnum {
    WAIT_TO_CONFIRM = 'wait-to-confirm',
    WAIT_TO_COMPLETE = 'wait-to-complete',
    WAIT_TO_VERIFY = 'wait-to-verify',
    DONE = 'done',
}

export default {
    enum: InProgressStatusEnum,
    values: returnEnumValues(InProgressStatusEnum),
};
