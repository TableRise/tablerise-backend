import index from 'src/domains/users/schemas';

describe('Domains :: User :: Schemas :: Index', () => {
    context('When schemas index', () => {
        it('should have correct keys', () => {
            const keys = [
                'userZod',
                'userDetailZod',
                'emailUpdateZod',
                'passwordUpdateZod',
                'updateUserZod',
                'oAuthComplete',
            ];
            const indexKeys = Object.keys(index);

            keys.forEach((key: string, index: number) => {
                expect(key).to.be.equal(indexKeys[index]);
            });
        });
    });
});
