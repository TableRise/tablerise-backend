import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { updateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CharacterCoreDependencies['updateCharacterServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    async update({ characterId, payload }: updateCharacterPayload): Promise<CharactersDnd> {
        this.logger('info', 'UpdateCharacterService - Update');

        const characterInDb = await this.charactersRepository.findOne({ characterId });
        const { profile: profilePayload, stats: statsPayload, money: moneyPayload } = payload.data;

        const dbProfile = characterInDb.data.profile;
        const dbStats = characterInDb.data.stats;
        const dbCharacteristics = dbProfile?.characteristics ?? ({} as any);
        const characteristicsPayload = profilePayload?.characteristics;

        const characterToUpdate: CharactersDnd = {
            ...characterInDb,
            data: {
                ...characterInDb.data,
                profile: {
                    ...dbProfile,
                    ...(profilePayload ?? {}),
                    characteristics: {
                        ...dbCharacteristics,
                        ...(characteristicsPayload ?? {}),
                        appearance: {
                            ...(dbCharacteristics.appearance ?? {}),
                            ...(characteristicsPayload?.appearance ?? {}),
                        },
                        other: {
                            ...(dbCharacteristics.other ?? {}),
                            ...(characteristicsPayload?.other ?? {}),
                        },
                        alliesAndOrgs: dbCharacteristics.alliesAndOrgs,
                        treasure: dbCharacteristics.treasure,
                    },
                },
                stats: {
                    ...dbStats,
                    ...(statsPayload ?? {}),
                    hitPoints: {
                        ...(dbStats?.hitPoints ?? {}),
                        ...(statsPayload?.hitPoints ?? {}),
                    },
                    deathSaves: {
                        ...(dbStats?.deathSaves ?? {}),
                        ...(statsPayload?.deathSaves ?? {}),
                    },
                    spellCasting: {
                        ...(dbStats?.spellCasting ?? {}),
                        ...(statsPayload?.spellCasting ?? {}),
                    },
                    abilityScores: dbStats?.abilityScores,
                    skills: dbStats?.skills,
                },
                money: {
                    ...(characterInDb.data.money ?? {}),
                    ...(moneyPayload ?? {}),
                },
            },
        };

        return this.charactersRepository.update({
            query: { characterId },
            payload: characterToUpdate,
        });
    }
}
