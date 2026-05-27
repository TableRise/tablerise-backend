import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import AddEquipmentService from 'src/core/characters/services/AddEquipmentService';

describe('Core :: Characters :: Services :: AddEquipmentService', () => {
    let addEquipmentService: AddEquipmentService;
    let charactersRepository: any;
    let dungeonsAndDragonsRepository: any;
    let character: any;

    const logger = (): void => {};

    beforeEach(() => {
        character = CharacterDomainDataFaker.generateCharactersJSON()[0];
        character.data.equipments = [];

        charactersRepository = {
            findOne: sinon.stub().resolves(character),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        dungeonsAndDragonsRepository = {
            setEntity: sinon.stub(),
            findOne: sinon.stub().resolves({
                name: 'Longsword',
                price: [15, 'PO'],
            }),
        };

        addEquipmentService = new AddEquipmentService({
            charactersRepository,
            dungeonsAndDragonsRepository,
            logger,
        } as any);
    });

    it('should append the looked-up equipment to the character', async () => {
        const result = await addEquipmentService.add({
            characterId: character.characterId,
            equipmentId: 'equipment-1',
        });

        expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Equipment');
        expect(result.data.equipments).to.deep.equal([
            {
                name: 'Longsword',
                price: [15, 'PO'],
                equipmentId: 'equipment-1',
            },
        ]);
    });

    it('should reject duplicated equipments', async () => {
        character.data.equipments = [{ equipmentId: 'equipment-1' }];

        try {
            await addEquipmentService.add({
                characterId: character.characterId,
                equipmentId: 'equipment-1',
            });
            expect.fail('Expected duplicate equipment error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('Equipment already added to character');
            expect(err.code).to.equal(HttpStatusCode.CONFLICT);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.CONFLICT));
        }
    });

    it('should append equipment when the character has no equipments array', async () => {
        character.data.equipments = undefined;

        const result = await addEquipmentService.add({
            characterId: character.characterId,
            equipmentId: 'equipment-2',
        });

        expect(result.data.equipments).to.deep.equal([
            {
                name: 'Longsword',
                price: [15, 'PO'],
                equipmentId: 'equipment-2',
            },
        ]);
    });
});
