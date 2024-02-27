import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum questionEnum {
    ALIVE = 'alive',
    DEAD = 'dead',
    VIEWER = 'viewer',
}

export default {
    enum: questionEnum,
    values: returnEnumValues(questionEnum),
};
