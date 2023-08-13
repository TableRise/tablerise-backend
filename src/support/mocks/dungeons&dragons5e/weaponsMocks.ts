import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';
import Mock from 'src/types/Mock';

const weaponMockEn: Weapon = {
    type: 'Simple Melee',
    name: 'Club',
    description: 'A simple club',
    cost: {
        currency: 'sp',
        value: 1,
    },
    weight: 2,
    damage: '1d4 bludgeoning',
    properties: ['Light'],
};

const weaponMockPt: Weapon = {
    type: 'Corpo a corpo simples',
    name: 'Clava',
    description: 'Uma simples clava',
    cost: {
        currency: 'sp',
        value: 1,
    },
    weight: 2,
    damage: '1d4 contundente',
    properties: ['Leve'],
};

const weapon: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: weaponMockEn,
        pt: weaponMockPt,
    },
    description: 'Mock an instance of a RPG weapon',
};

export default weapon;
