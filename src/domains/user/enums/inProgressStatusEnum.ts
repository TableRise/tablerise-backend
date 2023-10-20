import returnEnumValues from 'src/infra/helpers/returnEnumValues';

enum InProgressStatusEnum {
    WAIT_TO_CONFIRM = 'wait_to_confirm',
    WAIT_TO_COMPLETE = 'wait_to_complete',
    WAIT_TO_VERIFY = 'wait_to_verify',
    EMAIL_CHANGE = 'email_change',
    DONE = 'done',
}

export default {
    enumerate: InProgressStatusEnum,
    values: returnEnumValues(InProgressStatusEnum)
}
