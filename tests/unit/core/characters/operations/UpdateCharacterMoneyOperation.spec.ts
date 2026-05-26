import sinon from 'sinon';
import UpdateCharacterMoneyOperation from 'src/core/characters/operations/UpdateCharacterMoneyOperation';

describe('Core :: Characters :: Operations :: UpdateCharacterMoneyOperation', () => {
    it('should delegate to the update character money service', async () => {
        const updateCharacterMoneyService = {
            update: sinon.stub().resolves({ characterId: 'character-1' }),
        };

        const operation = new UpdateCharacterMoneyOperation({
            updateCharacterMoneyService,
            logger: () => {},
        } as any);

        const payload = {
            characterId: 'character-1',
            operation: 'add',
            money: 5,
            moneyType: 'PO',
        } as any;

        const result = await operation.execute(payload);

        expect(updateCharacterMoneyService.update).to.have.been.calledWith(payload);
        expect(result).to.deep.equal({ characterId: 'character-1' });
    });
});
