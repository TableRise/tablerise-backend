import sinon from 'sinon';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import RemoveEquipmentService from 'src/core/characters/services/RemoveEquipmentService';

describe('Core :: Characters :: Services :: RemoveEquipmentService', () => {
    let removeEquipmentService: RemoveEquipmentService;
    let charactersRepository: any;
    let character: any;

    const logger = (): void => {};

    beforeEach(() => {
        character = CharacterDomainDataFaker.generateCharactersJSON()[0];
        character.data.money = {
            cp: 0,
            sp: 10,
            ep: 0,
            gp: 0,
            pp: 0,
        };
        character.data.equipments = [
            {
                equipmentId: 'equipment-1',
                price: [10, 'PP'],
            },
        ];

        charactersRepository = {
            findOne: sinon.stub().resolves(character),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        removeEquipmentService = new RemoveEquipmentService({
            charactersRepository,
            logger,
        } as any);
    });

    it('should remove the equipment and refund 90% using the mapped currency key', async () => {
        const result = await removeEquipmentService.remove({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
        });

        expect(result.data.equipments).to.deep.equal([]);
        expect(result.data.money.sp).to.equal(19);
    });

    it('should skip refunds for unknown or invalid prices and still remove the equipment', async () => {
        character.data.equipments = [
            {
                equipmentId: 'equipment-1',
                price: ['invalid', '??'],
            },
        ];

        const result = await removeEquipmentService.remove({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
        });

        expect(result.data.equipments).to.deep.equal([]);
        expect(result.data.money.sp).to.equal(10);
    });

    it('should remove an equipment even when there is no matching item to refund', async () => {
        const result = await removeEquipmentService.remove({
            characterId: character.characterId,
            equipmentId: 'missing-equipment',
        });

        expect(result.data.equipments).to.have.lengthOf(1);
        expect(result.data.money.sp).to.equal(10);
    });

    it('should skip refunds when the price tuple is incomplete', async () => {
        character.data.equipments = [
            {
                equipmentId: 'equipment-1',
                price: [10],
            },
        ];

        const result = await removeEquipmentService.remove({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
        });

        expect(result.data.equipments).to.deep.equal([]);
        expect(result.data.money.sp).to.equal(10);
    });

    it('should skip refunds when the item has no price field', async () => {
        character.data.equipments = [
            {
                equipmentId: 'equipment-1',
            },
        ];

        const result = await removeEquipmentService.remove({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
        });

        expect(result.data.equipments).to.deep.equal([]);
        expect(result.data.money.sp).to.equal(10);
    });

    it('should initialize the refunded currency from zero when the wallet key is missing', async () => {
        character.data.money = {
            cp: 0,
            ep: 0,
            gp: 0,
            pp: 0,
        } as any;
        character.data.equipments = [
            {
                equipmentId: 'equipment-1',
                price: [10, 'PP'],
            },
        ];

        const result = await removeEquipmentService.remove({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
        });

        expect(result.data.money.sp).to.equal(9);
    });

    it('should still remove equipments when the list is missing', async () => {
        character.data.equipments = undefined;

        const result = await removeEquipmentService.remove({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
        });

        expect(result.data.equipments).to.deep.equal([]);
    });
});
