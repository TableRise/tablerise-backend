import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const godInstanceEn: God = {
    name: 'Zeus',
    alignment: 'Neutral and Evil',
    suggestedDomains: 'Olympo',
    symbol: 'Lightning',
    pantheon: 'Greek',
};

const godInstancePt: God = {
    name: 'Zeus',
    alignment: 'Neutro e Mal',
    suggestedDomains: 'Olympo',
    symbol: 'Raio',
    pantheon: 'Grego',
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
