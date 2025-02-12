import desc from 'src/interface/characters/presentation/character/RoutesDescription';

describe('Interface :: Characters :: Presentation :: RoutesDescription', () => {
    context('When desc object has all route descriptions', () => {
        it('should has the correct length', () => {
            const descLength = Object.keys(desc).length;
            expect(descLength).to.be.equal(2);
        });
    });
});
