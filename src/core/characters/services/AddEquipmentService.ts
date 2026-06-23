import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { ManageEquipmentPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import {
    addXp,
    finalizeProgression,
    snapshotProgression,
    USER_XP_EVENTS,
} from 'src/domains/users/helpers/UserProgression';

export default class AddEquipmentService {
    private readonly charactersRepository;
    private readonly dungeonsAndDragonsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        charactersRepository,
        dungeonsAndDragonsRepository,
        usersDetailsRepository,
        logger,
    }: CharacterCoreDependencies['addEquipmentServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.add = this.add.bind(this);
    }

    async add({ characterId, equipmentId, userId }: ManageEquipmentPayload): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.add.name}`;
        this.logger('info', callName);

        const characterInDb = await this.charactersRepository.findOne({ characterId });
        if (characterInDb.author.userId !== userId) HttpRequestErrors.throwError('forbidden-role-operation');

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

        const savedCharacter = await this.charactersRepository.update({
            query: { characterId },
            payload: updatedCharacter as unknown as CharactersDnd,
        });

        const ownerDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!ownerDetails) HttpRequestErrors.throwError('user-inexistent');

        const progressionSnapshot = snapshotProgression(ownerDetails);
        addXp(ownerDetails, USER_XP_EVENTS.CHARACTER_EQUIPMENT_ADDITION);
        finalizeProgression(ownerDetails, progressionSnapshot);

        await this.usersDetailsRepository.update({
            query: { userDetailId: ownerDetails.userDetailId },
            payload: ownerDetails,
        });

        return savedCharacter;
    }
}
