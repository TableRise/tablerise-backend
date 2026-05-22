import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { updateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterOperation {
    private readonly updateCharacterService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        updateCharacterService,
        socketIO,
        logger,
    }: CharacterCoreDependencies['updateCharacterOperationContract']) {
        this.updateCharacterService = updateCharacterService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ characterId, payload }: updateCharacterPayload): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const updatedCharacter = await this.updateCharacterService.update({ characterId, payload });
        const summary = {
            currentHitPoints: updatedCharacter.data.stats.hitPoints.currentPoints ?? null,
            level: updatedCharacter.data.profile.level ?? null,
        };
        const updatedFields = this.getUpdatedFields(payload.data ?? {});

        if (updatedCharacter.campaignId) {
            this.socketIO.emitToCampaign(updatedCharacter.campaignId, 'character:updated', {
                characterId: updatedCharacter.characterId,
                campaignId: updatedCharacter.campaignId,
                updatedFields,
                summary,
                updatedAt: updatedCharacter.updatedAt,
            });
        }

        return updatedCharacter;
    }

    private getUpdatedFields(payloadData: Record<string, any>, path = ''): string[] {
        return Object.entries(payloadData).flatMap(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                return this.getUpdatedFields(value, currentPath);
            }

            return [currentPath];
        });
    }
}
