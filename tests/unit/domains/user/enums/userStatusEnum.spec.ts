import userStatusEnum from 'src/domains/users/enums/userStatusEnum';

describe('Domains :: User :: Enum :: UserStatusEnum', () => {
    const enumKeysFixed = ['WAIT_TO_CONFIRM', 'WAIT_TO_COMPLETE', 'WAIT_TO_VERIFY', 'DONE'];
    const enumValuesFixed = ['wait-to-confirm', 'wait-to-complete', 'wait-to-verify', 'done'];

    context('When enum key/values', () => {
        it('should have correct key/values', () => {
            const enumTest = userStatusEnum.enum;

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
            const enumTest = userStatusEnum.values;

            enumValuesFixed.forEach((key: string, index: number) => {
                expect(enumTest[index]).to.be.equal(key);
            });
        });
    });
});
