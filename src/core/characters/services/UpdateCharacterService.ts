import { CharacterInstance } from "src/domains/characters/schemas/characterPostValidationSchema";
import { updateCharacterPayload } from "src/types/api/characters/http/payload";
import CharacterCoreDependencies from "src/types/modules/core/characters/CharacterCoreDependencies";

export default class UpdateCharacterService {
    private readonly _charactersRepository;
    private readonly _logger;

    constructor({
        charactersRepository,
        logger
    }: CharacterCoreDependencies['updateCharacterServiceContract']) {
        this._charactersRepository = charactersRepository;
        this._logger = logger;

        this.update = this.update.bind(this);
    }

    async update({ characterId, payload }: updateCharacterPayload): Promise<CharacterInstance> {
        this._logger('info', 'UpdateCharacterService - Update');

        const characterInDb = await this._charactersRepository.findOne({ characterId });

        if (!payload.data.profile.characteristics) payload.data.profile.characteristics = {} as any;
        if (!payload.data.profile.characteristics.appearance) payload.data.profile.characteristics.appearance = {} as any;
        if (!payload.data.profile.characteristics.other) payload.data.profile.characteristics.other = {} as any;
        if (!payload.data.profile.characteristics.other) payload.data.profile.characteristics.other = {} as any;
        if (!payload.data.stats.hitPoints) payload.data.stats.hitPoints = {} as any;
        if (!payload.data.stats.deathSaves) payload.data.stats.deathSaves = {} as any;
        if (!payload.data.stats.spellCasting) payload.data.stats.spellCasting= {} as any;


        const characterToUpdate = {
            ...characterInDb,
            data: {
                ...characterInDb.data,
                ...payload.data,
                profile: {
                    ...characterInDb.data.profile,
                    ...payload.data.profile,
                    characteristics: {
                        ...characterInDb.data.profile.characteristics,
                        ...payload.data.profile.characteristics,
                        appearance: {
                            ...characterInDb.data.profile.characteristics.appearance,
                            ...payload.data.profile.characteristics.appearance,
                        },
                        other: {
                            ...characterInDb.data.profile.characteristics.other,
                            ...payload.data.profile.characteristics.other,
                        }
                    }
                },
                stats: {
                    ...characterInDb.data.stats,
                    ...payload.data.stats,
                    hitPoints: {
                        ...characterInDb.data.stats.hitPoints,
                        ...payload.data.stats.hitPoints,
                    },
                    deathSaves: {
                        ...characterInDb.data.stats.deathSaves,
                        ...payload.data.stats.deathSaves,
                    },
                    spellCasting: {
                        ...characterInDb.data.stats.spellCasting,
                        ...payload.data.stats.spellCasting,
                    },
                },
                money: {
                    ...characterInDb.data.money,
                    ...payload.data.money
                },
            }
        };

        characterToUpdate.data.profile.characteristics.alliesAndOrgs = characterInDb.data.profile.characteristics.alliesAndOrgs;
        characterToUpdate.data.profile.characteristics.treasure = characterInDb.data.profile.characteristics.treasure;
        characterToUpdate.data.stats.abilityScores = characterInDb.data.stats.abilityScores;
        characterToUpdate.data.stats.skills = characterInDb.data.stats.skills;

        return this._charactersRepository.update({
            query: { characterId },
            payload: characterToUpdate
        });
    }
}
