import userGameInfoEnum from 'src/domains/users/enums/userGameInfoEnum';

describe('Domains :: Users :: Enums :: userGameInfoEnum', () => {
    it('should expose the expected enum values', () => {
        expect(userGameInfoEnum.enum.CAMPAIGNS).to.equal('campaigns');
        expect(userGameInfoEnum.enum.CHARACTERS).to.equal('characters');
        expect(userGameInfoEnum.enum.BADGES).to.equal('badges');
        expect(userGameInfoEnum.values).to.deep.equal(['campaigns', 'characters', 'badges']);
    });
});
