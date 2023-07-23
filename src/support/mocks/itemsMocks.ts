import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { Item } from 'src/schemas/itemsValidationSchema';
import Mock from 'src/types/Mock';

const itemMockEn: Item = {
    name: 'History of Valley',
    description: 'contains maps od the valley',
    cost: {
        currency: 'sp',
        value: 25,
    },
    type: 'adventuring gear',
    weight: 5,
    mountOrVehicle: {
        isValid: false,
        speed: '',
        carryingCapacity: '',
    },
    tradeGoods: {
        isValid: false,
        goods: '',
    },
};

const itemMockPt: Item = {
    name: 'História do Vale',
    description: 'contém todos os mapas do vale',
    cost: {
        currency: 'po',
        value: 25,
    },
    type: 'item de aventura',
    weight: 5,
    mountOrVehicle: {
        isValid: false,
        speed: '',
        carryingCapacity: '',
    },
    tradeGoods: {
        isValid: false,
        goods: '',
    },
};

const itemsMocks: Mock = {
    instance: {
        _id: generateNewMongoID(),
        en: itemMockEn,
        pt: itemMockPt,
    },
    description: 'Mock an instance of Item',
};

export default itemsMocks;
