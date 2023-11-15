import returnEnumValues from 'src/infra/helpers/common/returnEnumValues';

enum questionEnum {
    WHAT_IS_YOUR_GRANDFATHER_LAST_NAME = 'what-is-your-grandfather-last-name',
    WHAT_IS_YOUR_HOME_ADDRESS = 'whats-your-home-address',
    WHAT_WAS_THE_NAME_OF_YOUR_FIRST_CHILDHOOD_FRIEND = 'what-was-the-name-of-your-first-childhood-friend',
    WHAT_IS_YOUR_BRIGHTEST_CHILDHOOD_DREAM = 'what-is-your-brightest-childhood-dream',
    WHAT_COLOR_DO_YOU_LIKE_THE_MOST = 'what-color-do-you-like-the-most',
    WHAT_IS_YOUR_FAVORITE_ARTIST = 'what-is-your-favorite-artist',
    WHAT_BOOK_DO_YOU_RECOMMEND_TO_YOUR_FRIENDS = 'what-book-do-you-recommend-to-your-friends',
    WHAT_WAS_THE_NAME_OF_YOUR_FIRST_SCHOOL_TEACHER = 'what-was-the-name-of-your-first-school-teacher',
    WHAT_YEAR_DID_YOU_ENTER_COLLEGE = 'what-year-did-you-enter-college',
}

export default {
    enum: questionEnum,
    values: returnEnumValues(questionEnum),
};
