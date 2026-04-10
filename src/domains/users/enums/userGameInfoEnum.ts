import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum userGameInfoEnum {
    CAMPAIGNS = 'campaigns',
    CHARACTERS = 'characters',
    BADGES = 'badges',
}

export default {
    enum: userGameInfoEnum,
    values: returnEnumValues(userGameInfoEnum),
};
