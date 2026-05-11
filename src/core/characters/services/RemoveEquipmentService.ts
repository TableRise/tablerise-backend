import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ManageEquipmentPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

const UNIT_MAP: Record<string, string> = {
    PC: 'cp',
    PP: 'pp',
    PE: 'ep',
    PO: 'gp',
    PL: 'sp',
};

export default class RemoveEquipmentService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CharacterCoreDependencies['removeEquipmentServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;

        this.remove = this.remove.bind(this);
    }

    async remove({ characterId, equipmentId }: ManageEquipmentPayload): Promise<CharactersDnd> {
        this.logger('info', 'RemoveEquipmentService - Remove');

        const characterInDb = await this.charactersRepository.findOne({ characterId });

        const item = (characterInDb.data.equipments ?? []).find((e: any) => e.equipmentId === equipmentId);

        if (item) {
            const price: any[] = item.price ?? [];
            if (price.length >= 2) {
                const value = Number(price[0]);
                const unitKey = UNIT_MAP[price[1]];
                if (unitKey && !Number.isNaN(value)) {
                    (characterInDb.data.money as any)[unitKey] =
                        ((characterInDb.data.money as any)[unitKey] ?? 0) + Math.floor(value * 0.9);
                }
            }
        }

        const updatedCharacter = {
            ...characterInDb,
            data: {
                ...characterInDb.data,
                equipments: (characterInDb.data.equipments ?? []).filter((e: any) => e.equipmentId !== equipmentId),
            },
        };

        return this.charactersRepository.update({
            query: { characterId },
            payload: updatedCharacter as unknown as CharactersDnd,
        });
    }
}
