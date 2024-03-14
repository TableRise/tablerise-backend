import campaignVisibilityEnum from 'src/domains/campaigns/enums/campaignVisibilityEnum';

describe('Domains :: Campaign :: Enum :: campaignVisibilityEnum', () => {
    const enumKeysFixed = ['HIDDEN', 'VISIBLE'];
    const enumValuesFixed = ['hidden', 'visible'];

    context('When enum key/values', () => {
        it('should have correct key/values', () => {
            const enumTest = campaignVisibilityEnum.enum;

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
            const enumTest = campaignVisibilityEnum.values;

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});
