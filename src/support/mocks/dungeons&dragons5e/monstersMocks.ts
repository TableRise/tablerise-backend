import { DnDMonster } from '@tablerise/database-management';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const monsterMockEn: DnDMonster = {
    name: 'Cthulu',
    characteristics: [],
    stats: {
        armorClass: 2,
        hitPoints: {
            hitDice: '1d6',
            default: 10,
        },
        speed: '9',
        savingThrows: [],
        damageImmunities: [],
        conditionImmunities: [],
        damageResistances: [],
        senses: [],
        languages: [],
        challengeLevel: 10,
    },
    abilityScore: [],
    skills: [],
    actions: [],
    picture: 'https://img.db.com',
};

const monsterMockPt: DnDMonster = {
    name: 'Cthulu',
    characteristics: [],
    stats: {
        armorClass: 2,
        hitPoints: {
            hitDice: '1d6',
            default: 10,
        },
        speed: '9',
        savingThrows: [],
        damageImmunities: [],
        conditionImmunities: [],
        damageResistances: [],
        senses: [],
        languages: [],
        challengeLevel: 10,
    },
    abilityScore: [],
    skills: [],
    actions: [],
    picture: 'https://img.db.com',
};

const monster: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: monsterMockEn,
        pt: monsterMockPt,
    },
    description: 'Mock an instance of a RPG monster',
};

export default monster;
