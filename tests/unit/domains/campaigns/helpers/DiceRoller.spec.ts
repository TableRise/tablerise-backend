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

    it('should support negative dice terms', () => {
        sinon.stub(Math, 'random').returns(0.5);

        const result = rollDiceNotation('-1d6+4');

        expect(result.rolls).to.be.deep.equal([4]);
        expect(result.total).to.be.equal(0);
    });

    it('should support omitted dice count and leading or standalone modifiers', () => {
        sinon.stub(Math, 'random').returns(0);

        const result = rollDiceNotation('d6+2');
        expect(result.rolls).to.deep.equal([1]);
        expect(result.total).to.equal(3);

        const modifierOnly = rollDiceNotation('+7');
        expect(modifierOnly.rolls).to.deep.equal([]);
        expect(modifierOnly.total).to.equal(7);
    });

    it('should throw when the notation is empty', () => {
        expect(() => rollDiceNotation('')).to.throw('Dice notation is empty');
    });

    it('should throw when a notation term is unsupported', () => {
        expect(() => rollDiceNotation('1d6+foo')).to.throw('Unsupported dice notation term: +foo');
    });

    it('should allow zero-count dice terms without rolling', () => {
        sinon.stub(Math, 'random').returns(0.5);

        const result = rollDiceNotation('0d6+2');

        expect(result.rolls).to.deep.equal([]);
        expect(result.total).to.equal(2);
    });
});
