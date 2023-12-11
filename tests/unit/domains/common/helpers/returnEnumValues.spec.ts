import pronounEnum from 'src/domains/user/enums/pronounEnum';
import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';

describe('Domains :: Common :: Helpers :: ReturnEnumValues', () => {
    const enumValuesFixed = ['he/his', 'she/her', 'they/them', 'he/his - she/her', 'any'];

    context('When enum values', () => {
        it('should have correct key/values', () => {
            const enumTest = returnEnumValues(pronounEnum.enum);

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});
