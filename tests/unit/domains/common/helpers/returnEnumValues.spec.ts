import returnEnumValues from 'src/domains/common/helpers/returnEnumValues';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('Domains :: Common :: Helpers :: ReturnEnumValues', () => {
    const enumValuesFixed = [
        'no-current-flow',
        'update-password',
        'create-user',
        'activate-secret-question',
        'activate-two-factor',
        'reset-two-factor',
        'update-email',
        'reset-profile',
        'delete-user',
        'disable-two-factor',
    ];

    context('When enum values', () => {
        it('should have correct values', () => {
            const enumTest = returnEnumValues(stateFlowsEnum.enum);

            enumValuesFixed.forEach((value: string, index: number) => {
                expect(enumTest[index]).to.be.equal(value);
            });
        });
    });
});
