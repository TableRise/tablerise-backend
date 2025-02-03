import index from 'src/domains/characters/schemas';

describe('Domains :: Characters :: Schemas :: Index', () => {
    context('When schemas index', () => {
        it('should have correct keys', () => {
            const keys = ['characterPostZod'];
            const indexKeys = Object.keys(index);

            keys.forEach((key: string, index: number) => {
                expect(key).to.be.equal(indexKeys[index]);
            });
        });
    });
});
