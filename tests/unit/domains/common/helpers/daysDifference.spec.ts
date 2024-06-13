import daysDifference from 'src/domains/common/helpers/daysDifference';

describe('Domains :: Common :: Helpers :: daysDifference', () => {
    context('When called', () => {
        const FIFTEEN_DAYS = 15;

        it('should return false if days difference is lower than 15 days', () => {
            const testDate = new Date().getTime();
            const greaterThanFifteen = daysDifference(testDate, FIFTEEN_DAYS);

            expect(typeof greaterThanFifteen).to.be.equal('boolean');
            expect(greaterThanFifteen).to.be.equal(false);
        });

        it('should return true if days difference is greater or equal 15 days', () => {
            const testDate = new Date('2024-05-10').getTime();
            const greaterThanFifteen = daysDifference(testDate, FIFTEEN_DAYS);

            expect(typeof greaterThanFifteen).to.be.equal('boolean');
            expect(greaterThanFifteen).to.be.equal(true);
        });
    });
});