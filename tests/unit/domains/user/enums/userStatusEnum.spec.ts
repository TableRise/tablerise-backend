import userStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

describe('Domains :: User :: Enum :: UserStatusEnum', () => {
    const enumKeysFixed = [
        'WAIT_TO_CONFIRM',
        'WAIT_TO_COMPLETE',
        'WAIT_TO_VERIFY',
        'WAIT_TO_CHANGE_EMAIL',
        'WAIT_TO_START_PASSWORD_CHANGE',
        'WAIT_TO_FINISH_PASSWORD_CHANGE',
        'WAIT_TO_DELETE_USER',
        'WAIT_TO_SECRET_QUESTION',
        'DONE',
    ];
    const enumValuesFixed = [
        'wait-to-confirm',
        'wait-to-complete',
        'wait-to-verify',
        'wait-to-change-email',
        'wait-to-start-password-change',
        'wait-to-finish-password-change',
        'wait-to-delete-user',
        'wait-to-secret-question',
        'done',
    ];

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
