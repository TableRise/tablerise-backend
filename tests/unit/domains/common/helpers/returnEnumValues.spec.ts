import questionEnum from 'src/domains/users/enums/questionEnum';
import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

describe('Domains :: Common :: Helpers :: ReturnEnumValues', () => {
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

    context('When enum values', () => {
        it('should have correct values', () => {
            const enumTest = returnEnumValues(questionEnum.enum);

            enumValuesFixed.forEach((value: string, index: number) => {
                expect(enumTest[index]).to.be.equal(value);
            });
        });
    });
});
