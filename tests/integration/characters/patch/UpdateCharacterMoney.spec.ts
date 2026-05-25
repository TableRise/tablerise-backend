import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import { InjectNewCharacter } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a character money is updated', () => {
    let character: CharactersDnd;

    beforeEach(async () => {
        character = {
            characterId: newUUID(),
            campaignId: newUUID(),
            matchId: null,
            author: {
                userId: newUUID(),
                nickname: 'Percy',
                fullname: 'Adson Gomes Oliveira',
            },
            data: {
                profile: {
                    name: 'Teste',
                    class: newUUID(),
                    race: newUUID(),
                    level: 1,
                    xp: 0,
                    characteristics: {
                        alignment: 'N/A',
                        backstory: 'N/A',
                        background: 'N/A',
                        personalityTraits: 'N/A',
                        ideals: 'N/A',
                        bonds: 'N/A',
                        flaws: 'N/A',
                        appearance: {
                            eyes: 'azul',
                            age: '12',
                            weight: 'N/A',
                            height: '132',
                            skin: 'N/A',
                            hair: 'N/A',
                            picture: null,
                            description: 'N/A',
                        },
                        alliesAndOrgs: 'N/A',
                        other: {
                            characteristicsAndAbilities: 'N/A',
                        },
                        treasure: 'N/A',
                    },
                },
                stats: {
                    abilityScores: [
                        { ability: 'str', value: 16, modifier: 3, proficiency: false },
                        { ability: 'dex', value: 16, modifier: 3, proficiency: true },
                        { ability: 'con', value: 12, modifier: 1, proficiency: false },
                        { ability: 'int', value: 8, modifier: -1, proficiency: true },
                        { ability: 'wis', value: 15, modifier: 2, proficiency: false },
                        { ability: 'cha', value: 10, modifier: 0, proficiency: false },
                    ],
                    skills: [
                        { name: 'history', value: 1, checked: true },
                        { name: 'medicine', value: 4, checked: true },
                    ],
                    proficiencyBonus: 2,
                    inspiration: 0,
                    passiveWisdom: 12,
                    speed: 9.1,
                    initiative: 3,
                    armorClass: 13,
                    hitPoints: {
                        points: 9,
                        currentPoints: 9,
                        tempPoints: 0,
                        dicePoints: '1d8',
                    },
                    deathSaves: {
                        success: 0,
                        failures: 0,
                    },
                    spellCasting: {
                        class: 'Bardo',
                        ability: 'carisma',
                        saveDc: 10,
                        attackBonus: 2,
                    },
                },
                inventory: 'N/A',
                equipments: [
                    {
                        equipmentId: newUUID(),
                        name: 'Couro Batido',
                        type: 'Armadura Leve',
                        price: [45, 'PO'],
                        armorClass: [12, '+ DES'],
                        strength: null,
                        stealth: null,
                        weight: '6,5 kg',
                        damage: null,
                        properties: null,
                    },
                ],
                money: {
                    cp: 0,
                    sp: 118,
                    ep: 0,
                    gp: 85,
                    pp: 0,
                },
                spells: {
                    1: { spellIds: [], slotsTotal: 2, slotsExpended: 0 },
                    2: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    3: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    4: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    5: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    6: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    7: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    8: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    9: { spellIds: [], slotsTotal: 0, slotsExpended: 0 },
                    cantrips: [],
                },
                extraAbilities: {
                    1: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    2: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    3: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    4: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    5: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    6: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    7: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    8: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    9: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                    cantrips: [],
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as any,
            npc: false,
            picture: {
                request: { success: true, status: 200 },
                id: '',
                title: '',
                link: 'https://i.ibb.co/example.png',
                uploadDate: new Date().toISOString(),
                deleteUrl: '',
            },
            logs: [
                {
                    message: 'Personagem criado com sucesso',
                    loggedAt: '2026-05-24',
                },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as CharactersDnd;

        await InjectNewCharacter(character);
    });

    it('should add PL to pp in the response payload', async () => {
        const { body } = await requester()
            .patch(`/characters/${character.characterId as string}/update/money`)
            .send({
                operation: 'add',
                money: 3,
                moneyType: 'PL',
            })
            .expect(HttpStatusCode.OK);

        expect(body.data.money.pp).to.equal(3);
        expect(body.data.money.sp).to.equal(118);
        expect(body.data.money.gp).to.equal(85);
    });
});
