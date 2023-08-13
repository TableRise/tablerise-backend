import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';
import Mock from 'src/types/Mock';

const monsterMockEn: Monster = {
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

const monsterMockPt: Monster = {
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
