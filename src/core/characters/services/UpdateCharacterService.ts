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
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);

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
        const currentLevel = this.resolveNumericValue(dbProfile?.level);
        const nextLevel = this.resolveNumericValue(profilePayload?.level);
        const leveledUp = currentLevel !== undefined && nextLevel !== undefined && nextLevel > currentLevel;
        const currentNotificationState = this.resolveBooleanValue(
            dbProfile?.notificationsOn ?? dbProfile?.notificationOn
        );
        const payloadNotificationState = this.resolveBooleanValue(
            profilePayload?.notificationsOn ?? profilePayload?.notificationOn
        );
        const nextNotificationState = leveledUp ? true : payloadNotificationState ?? currentNotificationState;
        const recalculatedHitPoints = this.getRecalculatedHitPoints({
            dbAbilityScores: dbStats?.abilityScores,
            payloadAbilityScores: statsPayload?.abilityScores,
            dbHitPoints: dbStats?.hitPoints,
            currentLevel,
            nextLevel,
        });

        const characterToUpdate = {
            ...characterInDb,
            data: {
                ...characterInDb.data,
                profile: {
                    ...dbProfile,
                    ...(profilePayload ?? {}),
                    ...(leveledUp
                        ? {
                              prevLevel: currentLevel,
                          }
                        : {}),
                    ...(nextNotificationState !== undefined
                        ? {
                              notificationsOn: nextNotificationState,
                              notificationOn: nextNotificationState,
                          }
                        : {}),
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
                        ...(recalculatedHitPoints ?? {}),
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

    private getRecalculatedHitPoints({
        dbAbilityScores,
        payloadAbilityScores,
        dbHitPoints,
        currentLevel,
        nextLevel,
    }: {
        dbAbilityScores?: Array<{ ability?: string; modifier?: number; value?: number }>;
        payloadAbilityScores?: Array<{ ability?: string; modifier?: number; value?: number }>;
        dbHitPoints?: { points?: number; currentPoints?: number };
        currentLevel?: number;
        nextLevel?: number;
    }): { points?: number; currentPoints?: number } | undefined {
        const storedConstitution = this.findAbilityScoreByName(dbAbilityScores, ['constitution', 'con']);
        const updatedConstitution = this.findAbilityScoreByName(payloadAbilityScores, ['constitution', 'con']);
        const storedModifier = this.resolveAbilityModifier(storedConstitution);
        const updatedModifier = this.resolveAbilityModifier(updatedConstitution);

        if (typeof storedModifier !== 'number' || typeof updatedModifier !== 'number') {
            return undefined;
        }

        const modifierDelta = updatedModifier - storedModifier;

        if (modifierDelta === 0) {
            return undefined;
        }

        const effectiveLevel = typeof nextLevel === 'number' ? nextLevel : currentLevel;

        if (typeof effectiveLevel !== 'number') {
            return undefined;
        }

        const hitPointDelta = modifierDelta * effectiveLevel;
        const recalculatedHitPoints: { points?: number; currentPoints?: number } = {};

        if (typeof dbHitPoints?.points === 'number') {
            recalculatedHitPoints.points = dbHitPoints.points + hitPointDelta;
        }

        if (typeof dbHitPoints?.currentPoints === 'number') {
            recalculatedHitPoints.currentPoints = dbHitPoints.currentPoints + hitPointDelta;
        }

        return Object.keys(recalculatedHitPoints).length > 0 ? recalculatedHitPoints : undefined;
    }

    private findAbilityScoreByName(
        abilityScores: Array<{ ability?: string; modifier?: number; value?: number }> | undefined,
        abilityNames: string[]
    ): { ability?: string; modifier?: number; value?: number } | undefined {
        if (!Array.isArray(abilityScores)) {
            return undefined;
        }

        const normalizedNames = abilityNames.map((abilityName) => abilityName.toLowerCase());

        return abilityScores.find(
            (abilityScore) =>
                typeof abilityScore?.ability === 'string' &&
                normalizedNames.includes(abilityScore.ability.toLowerCase())
        );
    }

    private resolveAbilityModifier(abilityScore?: {
        ability?: string;
        modifier?: number;
        value?: number;
    }): number | undefined {
        if (typeof abilityScore?.modifier === 'number') {
            return abilityScore.modifier;
        }

        if (typeof abilityScore?.value === 'number') {
            return Math.floor((abilityScore.value - 10) / 2);
        }

        return undefined;
    }

    private resolveBooleanValue(value: unknown): boolean | undefined {
        if (typeof value === 'boolean') {
            return value;
        }

        if (typeof value === 'string') {
            if (value === 'true') return true;
            if (value === 'false') return false;
        }

        return undefined;
    }

    private resolveNumericValue(value: unknown): number | undefined {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === 'string') {
            const parsedValue = Number(value);

            if (Number.isFinite(parsedValue)) {
                return parsedValue;
            }
        }

        return undefined;
    }
}
