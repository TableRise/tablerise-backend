import sinon from 'sinon';
import AddEquipmentOperation from 'src/core/characters/operations/AddEquipmentOperation';

describe('Core :: Characters :: Operations :: AddEquipmentOperation', () => {
    it('should delegate to the add equipment service', async () => {
        const addEquipmentService = {
            add: sinon.stub().resolves({ characterId: 'character-1' }),
        };

        const operation = new AddEquipmentOperation({
            addEquipmentService,
            logger: () => {},
        } as any);

        const result = await operation.execute({
            characterId: 'character-1',
            equipmentId: 'equipment-1',
        });

        expect(addEquipmentService.add).to.have.been.calledWith({
            characterId: 'character-1',
            equipmentId: 'equipment-1',
        });
        expect(result).to.deep.equal({ characterId: 'character-1' });
    });
});
