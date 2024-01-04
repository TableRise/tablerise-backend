import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

enum PronounEnum {
    HE_HIS = 'he/his',
    SHE_HER = 'she/her',
    THEY_THEM = 'they/them',
    HE_HIS_SHE_HER = 'he/his - she/her',
    ANY = 'any',
}

export default {
    enum: PronounEnum,
    values: returnEnumValues(PronounEnum),
};
