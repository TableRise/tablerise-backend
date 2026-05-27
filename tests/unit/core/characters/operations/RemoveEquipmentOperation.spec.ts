import sinon from 'sinon';
import RemoveEquipmentOperation from 'src/core/characters/operations/RemoveEquipmentOperation';

describe('Core :: Characters :: Operations :: RemoveEquipmentOperation', () => {
    it('should delegate to the remove equipment service', async () => {
        const removeEquipmentService = {
            remove: sinon.stub().resolves({ characterId: 'character-1' }),
        };

        const operation = new RemoveEquipmentOperation({
            removeEquipmentService,
            logger: () => {},
        } as any);

        const result = await operation.execute({
            characterId: 'character-1',
            equipmentId: 'equipment-1',
        });

        expect(removeEquipmentService.remove).to.have.been.calledWith({
            characterId: 'character-1',
            equipmentId: 'equipment-1',
        });
        expect(result).to.deep.equal({ characterId: 'character-1' });
    });
});
