import sinon from 'sinon';
import { rollDiceNotation } from 'src/domains/campaigns/helpers/DiceRoller';

describe('Domains :: Campaigns :: Helpers :: DiceRoller', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should roll all dice terms and modifiers', () => {
        sinon.stub(Math, 'random').onFirstCall().returns(0).onSecondCall().returns(0.5).onThirdCall().returns(0.25);

        const result = rollDiceNotation('2d6+1d4+3');

        expect(result.rolls).to.be.deep.equal([1, 4, 2]);
        expect(result.total).to.be.equal(10);
        expect(result.rollId).to.be.a('string');
    });

    it('should support negative modifiers', () => {
        sinon.stub(Math, 'random').returns(0);

        const result = rollDiceNotation('1d8-2');

        expect(result.rolls).to.be.deep.equal([1]);
        expect(result.total).to.be.equal(-1);
    });
});
