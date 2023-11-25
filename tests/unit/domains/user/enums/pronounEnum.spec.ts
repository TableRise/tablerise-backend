import pronounEnum from 'src/domains/user/enums/pronounEnum';

describe('Domains :: User :: Enum :: PronounEnum', () => {
    const enumKeysFixed = ['HE_HIS', 'SHE_HER', 'THEY_THEM', 'HE_HIS_SHE_HER', 'ANY'];
    const enumValuesFixed = ['he/his', 'she/her', 'they/them', 'he/his - she/her', 'any'];

    context('When enum key/values', () => {
        it('should have correct key/values', () => {
            const enumTest = pronounEnum.enum;

            enumKeysFixed.forEach((key: string, index: number) => {
                expect(enumTest[key as keyof typeof enumTest]).to.be.equal(enumValuesFixed[index]);
            });
        });
    });

    context('When enum values', () => {
        it('should have correct key/values', () => {
            const enumTest = pronounEnum.values;

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});