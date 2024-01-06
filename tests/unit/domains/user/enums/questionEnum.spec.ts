import questionEnum from 'src/domains/users/enums/questionEnum';

describe('Domains :: User :: Enum :: QuestionEnum', () => {
    const enumKeysFixed = [
        'WHAT_IS_YOUR_GRANDFATHER_LAST_NAME',
        'WHAT_IS_YOUR_HOME_ADDRESS',
        'WHAT_WAS_THE_NAME_OF_YOUR_FIRST_CHILDHOOD_FRIEND',
        'WHAT_IS_YOUR_BRIGHTEST_CHILDHOOD_DREAM',
        'WHAT_COLOR_DO_YOU_LIKE_THE_MOST',
        'WHAT_IS_YOUR_FAVORITE_ARTIST',
        'WHAT_BOOK_DO_YOU_RECOMMEND_TO_YOUR_FRIENDS',
        'WHAT_WAS_THE_NAME_OF_YOUR_FIRST_SCHOOL_TEACHER',
        'WHAT_YEAR_DID_YOU_ENTER_COLLEGE',
    ];
    const enumValuesFixed = [
        'what-is-your-grandfather-last-name',
        'whats-your-home-address',
        'what-was-the-name-of-your-first-childhood-friend',
        'what-is-your-brightest-childhood-dream',
        'what-color-do-you-like-the-most',
        'what-is-your-favorite-artist',
        'what-book-do-you-recommend-to-your-friends',
        'what-was-the-name-of-your-first-school-teacher',
        'what-year-did-you-enter-college',
    ];

    context('When enum key/values', () => {
        it('should have correct key/values', () => {
            const enumTest = questionEnum.enum;

            enumKeysFixed.forEach((key: string, index: number) => {
                expect(enumTest).to.have.property(key);
                expect(enumTest[key as keyof typeof enumTest]).to.be.equal(
                    enumValuesFixed[index]
                );
            });
        });
    });

    context('When enum values', () => {
        it('should have correct key/values', () => {
            const enumTest = questionEnum.values;

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});
