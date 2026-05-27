import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ManageEquipmentPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class AddEquipmentService {
    private readonly charactersRepository;
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({
        charactersRepository,
        dungeonsAndDragonsRepository,
        logger,
    }: CharacterCoreDependencies['addEquipmentServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.add = this.add.bind(this);
    }

    async add({ characterId, equipmentId }: ManageEquipmentPayload): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.add.name}`;
        this.logger('info', callName);

        const characterInDb = await this.charactersRepository.findOne({ characterId });

        const alreadyAdded = characterInDb.data.equipments?.some((e: any) => e.equipmentId === equipmentId);
        if (alreadyAdded) HttpRequestErrors.throwError('equipment-already-added');

        this.dungeonsAndDragonsRepository.setEntity('Equipment' as any);
        const equipment = await this.dungeonsAndDragonsRepository.findOne({ equipmentId });

        const updatedCharacter = {
            ...characterInDb,
            data: {
                ...characterInDb.data,
                equipments: [...(characterInDb.data.equipments ?? []), { ...(equipment as any), equipmentId }],
            },
        };

        return this.charactersRepository.update({
            query: { characterId },
            payload: updatedCharacter as unknown as CharactersDnd,
        });
    }
}
