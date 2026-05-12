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
        const {
            profile: profilePayload,
            stats: statsPayload,
            money: moneyPayload,
            spells: spellsPayload,
            extraAbilities: extraAbilitiesPayload,
            inventory: inventoryPayload,
        } = payload.data;

        const dbProfile = characterInDb.data.profile;
        const dbStats = characterInDb.data.stats;
        const dbCharacteristics = dbProfile?.characteristics ?? ({} as any);
        const characteristicsPayload = profilePayload?.characteristics;

        const characterToUpdate = {
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
                        alliesAndOrgs: characteristicsPayload?.alliesAndOrgs ?? dbCharacteristics.alliesAndOrgs,
                        treasure: characteristicsPayload?.treasure ?? dbCharacteristics.treasure,
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
                    abilityScores: statsPayload?.abilityScores ?? dbStats?.abilityScores,
                    skills: statsPayload?.skills ?? dbStats?.skills,
                },
                money: {
                    ...(characterInDb.data.money ?? {}),
                    ...(moneyPayload ?? {}),
                },
                spells: spellsPayload
                    ? {
                          ...(characterInDb.data.spells ?? {}),
                          cantrips: spellsPayload.cantrips ?? characterInDb.data.spells?.cantrips ?? [],
                          ...([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).reduce(
                              (acc, lvl) => ({
                                  ...acc,
                                  [lvl]: {
                                      ...(characterInDb.data.spells?.[lvl] ?? {}),
                                      ...(spellsPayload[lvl] ?? {}),
                                  },
                              }),
                              {}
                          ),
                      }
                    : characterInDb.data.spells,
                extraAbilities: extraAbilitiesPayload
                    ? {
                          ...(characterInDb.data.extraAbilities ?? {}),
                          cantrips: extraAbilitiesPayload.cantrips ?? characterInDb.data.extraAbilities?.cantrips ?? [],
                          ...([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).reduce(
                              (acc, lvl) => ({
                                  ...acc,
                                  [lvl]: {
                                      ...(characterInDb.data.extraAbilities?.[lvl] ?? {}),
                                      ...(extraAbilitiesPayload[lvl] ?? {}),
                                  },
                              }),
                              {}
                          ),
                      }
                    : characterInDb.data.extraAbilities,
                inventory: inventoryPayload ?? characterInDb.data.inventory,
                equipments: characterInDb.data.equipments,
            },
            characterId: characterInDb.characterId,
            campaignId: characterInDb.campaignId,
            matchId: characterInDb.matchId,
        };

        return this.charactersRepository.update({
            query: { characterId },
            payload: characterToUpdate as unknown as CharactersDnd,
        });
    }
}
