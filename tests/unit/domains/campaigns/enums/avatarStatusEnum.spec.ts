import avatarStatusEnum from 'src/domains/campaigns/enums/avatarStatusEnum';

describe('Domains :: Campaign :: Enum :: avatarStatusEnum', () => {
    const enumKeysFixed = ['ALIVE', 'DEAD', 'VIEWER'];
    const enumValuesFixed = ['alive', 'dead', 'viewer'];

    context('When enum key/values', () => {
        it('should have correct key/values', () => {
            const enumTest = avatarStatusEnum.enum;

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
            const enumTest = avatarStatusEnum.values;

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});
