import systemEnum from 'src/domains/common/enums/systemsEnum';

describe('Domains :: User :: Enum :: SystemEnum', () => {
    const enumKeysFixed = ['DND5E'];
    const enumValuesFixed = ['dnd5e'];

    context('When enum key/values', () => {
        it('should have correct key/values', () => {
            const enumTest = systemEnum.enum;

            enumKeysFixed.forEach((key: string, index: number) => {
                expect(enumTest[key as keyof typeof enumTest]).to.be.equal(
                    enumValuesFixed[index]
                );
            });
        });
    });

    context('When enum values', () => {
        it('should have correct key/values', () => {
            const enumTest = systemEnum.values;

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});
