import sinon from 'sinon';
import UpdateCharacterService from 'src/core/characters/services/UpdateCharacterService';

describe('Core :: Characters :: Services :: UpdateCharacterService', () => {
    const logger = (): void => {};

    it('should deeply merge nested profile, stats, spells, and extra abilities', async () => {
        const character = {
            characterId: 'character-1',
            campaignId: 'campaign-1',
            matchId: 'match-1',
            data: {
                profile: {
                    name: 'Old Name',
                    level: 1,
                    characteristics: {
                        appearance: { eyes: 'blue', age: '20' },
                        other: { characteristicsAndAbilities: 'Old' },
                        alliesAndOrgs: [{ orgName: 'Old Guild' }],
                        treasure: 'Old treasure',
                    },
                },
                stats: {
                    hitPoints: { points: 10, currentPoints: 8 },
                    deathSaves: { success: 1, failures: 0 },
                    spellCasting: { class: 'Wizard', ability: 'int' },
                    abilityScores: [{ ability: 'str', value: 10 }],
                    skills: [{ name: 'arcana', value: 3 }],
                },
                money: { gp: 10 },
                spells: {
                    cantrips: ['light'],
                    1: { spellIds: ['magic-missile'], slotsTotal: 2, slotsExpended: 0 },
                },
                extraAbilities: {
                    cantrips: ['minor-feature'],
                    1: { extraAbilityNames: ['dash'], slotsTotal: 1, slotsExpended: 0 },
                },
                inventory: 'rope',
                equipments: [{ equipmentId: 'equipment-1' }],
            },
        };

        const charactersRepository = {
            findOne: sinon.stub().resolves(character),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new UpdateCharacterService({
            charactersRepository,
            logger,
        } as any);

        const updated = await service.update({
            characterId: 'character-1',
            payload: {
                data: {
                    profile: {
                        name: 'New Name',
                        characteristics: {
                            appearance: { age: '21' },
                            other: { characteristicsAndAbilities: 'New' },
                        },
                    },
                    stats: {
                        hitPoints: { currentPoints: 6 },
                        spellCasting: { ability: 'wis' },
                    },
                    money: { gp: 12 },
                    spells: {
                        1: { slotsExpended: 1 },
                    },
                    extraAbilities: {
                        1: { slotsExpended: 1 },
                    },
                },
            } as any,
        });

        expect(updated.data.profile.name).to.equal('New Name');
        expect(updated.data.profile.characteristics.appearance).to.deep.equal({ eyes: 'blue', age: '21' });
        expect(updated.data.profile.characteristics.other).to.deep.equal({ characteristicsAndAbilities: 'New' });
        expect(updated.data.profile.characteristics.alliesAndOrgs).to.deep.equal([{ orgName: 'Old Guild' }]);
        expect(updated.data.profile.characteristics.treasure).to.equal('Old treasure');
        expect(updated.data.stats.hitPoints).to.deep.equal({ points: 10, currentPoints: 6 });
        expect(updated.data.stats.deathSaves).to.deep.equal({ success: 1, failures: 0 });
        expect(updated.data.stats.spellCasting).to.deep.equal({ class: 'Wizard', ability: 'wis' });
        expect(updated.data.stats.abilityScores).to.deep.equal([{ ability: 'str', value: 10 }]);
        expect(updated.data.stats.skills).to.deep.equal([{ name: 'arcana', value: 3 }]);
        expect(updated.data.money).to.deep.equal({ gp: 12 });
        expect(updated.data.spells.cantrips).to.deep.equal(['light']);
        expect(updated.data.spells[1]).to.deep.equal({
            spellIds: ['magic-missile'],
            slotsTotal: 2,
            slotsExpended: 1,
        });
        expect(updated.data.extraAbilities.cantrips).to.deep.equal(['minor-feature']);
        expect(updated.data.extraAbilities[1]).to.deep.equal({
            extraAbilityNames: ['dash'],
            slotsTotal: 1,
            slotsExpended: 1,
        });
        expect(updated.data.inventory).to.equal('rope');
        expect(updated.data.equipments).to.deep.equal([{ equipmentId: 'equipment-1' }]);
    });

    it('should create default spell and extra ability slots when the stored character has none', async () => {
        const character = {
            characterId: 'character-2',
            campaignId: null,
            matchId: null,
            data: {
                profile: {
                    name: 'Name',
                    characteristics: {},
                },
                stats: {},
                money: {},
                spells: null,
                extraAbilities: null,
                inventory: null,
                equipments: [],
            },
        };

        const charactersRepository = {
            findOne: sinon.stub().resolves(character),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new UpdateCharacterService({
            charactersRepository,
            logger,
        } as any);

        const updated = await service.update({
            characterId: 'character-2',
            payload: {
                data: {
                    spells: {
                        cantrips: undefined,
                        2: { slotsTotal: 3 },
                    },
                    extraAbilities: {
                        cantrips: undefined,
                        3: { slotsTotal: 1 },
                    },
                },
            } as any,
        });

        expect(updated.data.spells.cantrips).to.deep.equal([]);
        expect(updated.data.spells[1]).to.deep.equal({});
        expect(updated.data.spells[2]).to.deep.equal({ slotsTotal: 3 });
        expect(updated.data.extraAbilities.cantrips).to.deep.equal([]);
        expect(updated.data.extraAbilities[1]).to.deep.equal({});
        expect(updated.data.extraAbilities[3]).to.deep.equal({ slotsTotal: 1 });
    });

    it('should keep stored spells and extra abilities when they are omitted from the payload', async () => {
        const character = {
            characterId: 'character-3',
            campaignId: null,
            matchId: null,
            data: {
                profile: { characteristics: {} },
                stats: {},
                money: {},
                spells: { cantrips: ['firebolt'] },
                extraAbilities: { cantrips: ['dash'] },
                inventory: 'bag',
                equipments: [],
            },
        };

        const charactersRepository = {
            findOne: sinon.stub().resolves(character),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new UpdateCharacterService({
            charactersRepository,
            logger,
        } as any);

        const updated = await service.update({
            characterId: 'character-3',
            payload: {
                data: {
                    inventory: 'new bag',
                },
            } as any,
        });

        expect(updated.data.spells).to.deep.equal({ cantrips: ['firebolt'] });
        expect(updated.data.extraAbilities).to.deep.equal({ cantrips: ['dash'] });
        expect(updated.data.inventory).to.equal('new bag');
    });
});
