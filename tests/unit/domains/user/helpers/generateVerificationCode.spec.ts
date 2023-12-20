import generateVerificationCode from 'src/domains/user/helpers/generateVerificationCode';

describe('Domains :: User :: Helpers :: GenerateVerificationCode.ts', () => {
    context('When code is generated', () => {
        it('should have the right type and length', () => {
            const code = generateVerificationCode(16);
            expect(typeof code).to.be.equal('string');
            expect(code).to.have.length(16);
        });
    });
});
