import newUUID from 'src/domains/common/helpers/newUUID';
import dataGenerator from '../dataGenerator';
import { CharacterJSONPayload } from 'src/types/modules/infra/datafakers/characters/DomainDataFaker';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import DomainDataFaker from '../../campaigns/DomainDataFaker';

function createCharacterFaker({ characterId = newUUID() }: CharactersDnd): CharactersDnd {
    return {
        characterId,
        campaignId: newUUID(),
        matchId: newUUID(),
        author: {
            userId: newUUID(),
            nickname: dataGenerator.nickname(),
            fullname: `${dataGenerator.name.first('male')} ${dataGenerator.name.last('male')}`,
        },
        data: {
            profile: {
                name: dataGenerator.name.first('male'),
                class: 'Fighter',
                race: 'Human',
                level: 0,
                xp: 0,
                characteristics: {
                    alignment: 'hero',
                    backstory: dataGenerator.biography(),
                    background: 'wanderer',
                    personalityTraits: 'Fearless',
                    ideals: 'Be a hero',
                    bonds: 'no bonds',
                    flaws: 'Egocentric',
                    appearance: {
                        description: 'A brave wandering adventurer.',
                        eyes: 'blue',
                        age: '25',
                        weight: '85',
                        height: '1.82',
                        skin: 'white',
                        hair: 'black',
                        picture: DomainDataFaker.generateImagesObjectJSON()[0],
                    },
                    alliesAndOrgs: 'Haka',
                    other: {
                        characteristicsAndAbilities: 'Speaks human and orc. Skilled with knife throwing.',
                    },
                    treasure: '',
                },
            },
            stats: {
                abilityScores: [
                    {
                        ability: 'Wisdom',
                        value: 13,
                        modifier: 2,
                        proficiency: true,
                    },
                    {
                        ability: 'Constitution',
                        value: 0,
                        modifier: 0,
                        proficiency: false,
                    },
                    {
                        ability: 'Strength',
                        value: 0,
                        modifier: 0,
                        proficiency: false,
                    },
                    {
                        ability: 'Charisma',
                        value: 0,
                        modifier: 0,
                        proficiency: false,
                    },
                    {
                        ability: 'Intelligence',
                        value: 0,
                        modifier: 0,
                        proficiency: false,
                    },
                ],
                proficiencyBonus: 2,
                inspiration: 1,
                initiative: 1,
                passiveWisdom: 2,
                speed: 7.2,
                armorClass: 15,
                hitPoints: {
                    points: 50,
                    currentPoints: 23,
                    tempPoints: 5,
                    dicePoints: '2d10',
                },
                deathSaves: {
                    success: 0,
                    failures: 0,
                },
                spellCasting: {
                    class: 'sorcerer',
                    ability: 'charism',
                    saveDc: 15,
                    attackBonus: 12,
                },
                skills: [{ name: 'arcanism', value: 5, checked: false }],
            },
            inventory: 'Starter adventurer pack',
            equipments: [],
            money: {
                cp: 0,
                sp: 0,
                ep: 0,
                gp: 0,
                pp: 0,
            },
            spells: {
                cantrips: [],
                1: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                2: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                3: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                4: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                5: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                6: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                7: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                8: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
                9: {
                    spellIds: [],
                    slotsTotal: 2,
                    slotsExpended: 1,
                },
            },
            extraAbilities: {
                cantrips: [],
                1: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                2: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                3: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                4: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                5: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                6: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                7: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                8: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
                9: { extraAbilityNames: [], slotsTotal: 0, slotsExpended: 0 },
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        npc: false,
        picture: DomainDataFaker.generateImagesObjectJSON()[0],
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export default function generateCharactersFaker({ count, characterId }: CharacterJSONPayload): CharactersDnd[] {
    const characters: CharactersDnd[] = [];

    for (let index = 0; index <= count; index += 1) {
        characters.push(createCharacterFaker({ characterId } as CharactersDnd));
    }

    return characters;
}
