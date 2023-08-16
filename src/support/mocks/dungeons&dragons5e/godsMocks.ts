import { DnDGod } from '@tablerise/database-management';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const godInstanceEn: DnDGod = {
    name: 'Zeus',
    alignment: 'Neutral and Evil',
    suggestedDomains: 'Olympo',
    symbol: 'Lightning',
    phanteon: 'Greek',
};

const godInstancePt: DnDGod = {
    name: 'Zeus',
    alignment: 'Neutro e Mal',
    suggestedDomains: 'Olympo',
    symbol: 'Raio',
    phanteon: 'Grego',
};

const god: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: godInstanceEn,
        pt: godInstancePt,
    },
    description: 'Mock an instance of a RPG god',
};

export default god;
