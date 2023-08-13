import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';
import Mock from 'src/types/Mock';

const classMockEn: Class = {
    name: 'Bard',
    description: 'As a bard, you gain the following class features.',
    hitPoints: {
        hitDice: '1d8 per bard level',
        hitPointsAtFirstLevel: '8 + your Constitution modifier',
        hitPointsAtHigherLevels: '1d8 (or 5) + your Constitution modifier per bard level after 1st',
    },
    proficiencies: {
        armor: ['Light armor'],
        weapons: ['Simple weapons, hand crossbows, longswords, rapiers, shortswords'],
        tools: ['Three musical instruments of your choice'],
        savingThrows: ['Dexterity, Charisma'],
        skills: ['Choose any three'],
    },
    equipment: [
        {
            a: '123456789101112131415161',
            b: '123456789101112131415161',
        },
    ],
    levelingSpecs: {
        level: [1],
        proficiencyBonus: [1],
        features: ['Spellcasting'],
        cantripsKnown: {
            isValidToThisClass: true,
            amount: [1],
        },
        spellSlotsPerSpellLevel: {
            isValidToThisClass: true,
            spellLevel: [1],
            spellSpaces: [1],
        },
        spellsKnown: {
            isValidToThisClass: true,
            amount: [1],
        },
        kiPoints: {
            isValidToThisClass: true,
            amount: [1],
        },
        martialArts: {
            isValidToThisClass: true,
            amount: [1],
        },
        unarmoredMovement: {
            isValidToThisClass: true,
            amount: [1],
        },
        sneakAttack: {
            isValidToThisClass: true,
            amount: [1],
        },
        sorceryPoints: {
            isValidToThisClass: true,
            amount: [1],
        },
        invocationsKnown: {
            isValidToThisClass: true,
            amount: [1],
        },
        rages: {
            isValidToThisClass: true,
            amount: [1],
        },
        rageDamage: {
            isValidToThisClass: true,
            amount: [1],
        },
    },
    characteristics: [
        {
            title: 'Charming',
            description: 'He is very charming',
        },
    ],
};

const classMockPt: Class = {
    name: 'Bardo',
    description: 'Como um bardo, você ganha as seguintes características de classe.',
    hitPoints: {
        hitDice: '1d8 por nível de bardo',
        hitPointsAtFirstLevel: '8 + seu modificador de Constituição',
        hitPointsAtHigherLevels: '1d8 (ou 5) + seu modificador de Constituição por nível de bardo após o 1º',
    },
    proficiencies: {
        armor: ['Armadura leve'],
        weapons: ['Armas simples, bestas de mão, espadas longas, floretes, espadas curtas'],
        tools: ['Três instrumentos musicais de sua escolha'],
        savingThrows: ['Destreza, Carisma'],
        skills: ['Escolha quaisquer três'],
    },
    equipment: [
        {
            a: '123456789101112131415161',
            b: '123456789101112131415161',
        },
    ],
    levelingSpecs: {
        level: [1],
        proficiencyBonus: [1],
        features: ['Feitiço'],
        cantripsKnown: {
            isValidToThisClass: true,
            amount: [1],
        },
        spellSlotsPerSpellLevel: {
            isValidToThisClass: true,
            spellLevel: [1],
            spellSpaces: [1],
        },
        spellsKnown: {
            isValidToThisClass: true,
            amount: [1],
        },
        kiPoints: {
            isValidToThisClass: true,
            amount: [1],
        },
        martialArts: {
            isValidToThisClass: true,
            amount: [1],
        },
        unarmoredMovement: {
            isValidToThisClass: true,
            amount: [1],
        },
        sneakAttack: {
            isValidToThisClass: true,
            amount: [1],
        },
        sorceryPoints: {
            isValidToThisClass: true,
            amount: [1],
        },
        invocationsKnown: {
            isValidToThisClass: true,
            amount: [1],
        },
        rages: {
            isValidToThisClass: true,
            amount: [1],
        },
        rageDamage: {
            isValidToThisClass: true,
            amount: [1],
        },
    },
    characteristics: [
        {
            title: 'Encantador',
            description: 'Ele é muito charmoso',
        },
    ],
};

const _class: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: classMockEn,
        pt: classMockPt,
    },
    description: 'Mock an instance of a RPG class',
};

export default _class;
