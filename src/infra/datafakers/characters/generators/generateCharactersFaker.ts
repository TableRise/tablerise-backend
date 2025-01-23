import newUUID from 'src/domains/common/helpers/newUUID';
import dataGenerator from '../dataGenerator';
import { CharacterJSONPayload } from 'src/types/modules/infra/datafakers/characters/DomainDataFaker';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import DomainDataFaker from '../../campaigns/DomainDataFaker';

function createCharacterFaker({
    characterId = newUUID(),
}: CharacterInstance): CharacterInstance {
    return {
        characterId,
        campaignId: newUUID(),
        matchId: newUUID(),
        author: {
            userId: newUUID(),
            nickname: dataGenerator.nickname(),
            fullname: `${dataGenerator.name.first('male')} ${dataGenerator.name.last(
                'male'
            )}`,
        },
        data: {
            profile: {
                name: dataGenerator.name.first('male'),
                class: 'warrior',
                race: 'human',
                level: 0,
                xp: 0,
                characteristics: {
                    alignment: 'hero',
                    backstory: dataGenerator.biography(),
                    personalityTraits: 'Fearless',
                    ideals: 'Be a hero',
                    bonds: 'no bonds',
                    flaws: 'Egocentric',
                    appearance: {
                        eyes: 'blue',
                        age: '25',
                        weight: '85',
                        height: '1.82',
                        skin: 'white',
                        hair: 'black',
                        picture: DomainDataFaker.generateImagesObjectJSON()[0],
                    },
                    alliesAndOrgs: [
                        {
                            orgName: 'Haka',
                            symbol: DomainDataFaker.generateImagesObjectJSON()[0],
                            content: dataGenerator.lorem(),
                        },
                    ],
                    other: {
                        languages: ['human', 'orc'],
                        proficiencies: 'kniffe throwing',
                        extraCharacteristics: 'no characteristics',
                    },
                    treasure: [''],
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
                skills: {
                    arcanism: 5,
                },
            },
            attacks: [
                {
                    name: 'Some attack',
                    atkBonus: 2,
                    damage: [
                        {
                            type: 'magic',
                            bonus: 5,
                            dice: '',
                        },
                    ],
                },
            ],
            equipments: [''],
            money: {
                cp: 0,
                sp: 0,
                ep: 0,
                gp: 0,
                pp: 0,
            },
            features: [''],
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        NPC: false,
        picture: DomainDataFaker.generateImagesObjectJSON()[0],
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export default function generateCharactersFaker({
    count,
    characterId,
}: CharacterJSONPayload): CharacterInstance[] {
    const characters: CharacterInstance[] = [];

    for (let index = 0; index <= count; index += 1) {
        characters.push(createCharacterFaker({ characterId } as CharacterInstance));
    }

    return characters;
}
