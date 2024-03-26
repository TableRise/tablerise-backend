import index from 'src/domains/campaigns/schemas';

describe('Domains :: Campaign :: Schemas :: Index', () => {
    context('When schemas index', () => {
        it('should have correct keys', () => {
            const keys = ['campaignZod'];
            const indexKeys = Object.keys(index);

            keys.forEach((key: string, index: number) => {
                expect(key).to.be.equal(indexKeys[index]);
            });
        });
    });
});
