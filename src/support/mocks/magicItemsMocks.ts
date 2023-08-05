import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import Mock from 'src/types/Mock';

const magicItemMockEn: MagicItem = {
    name: 'History of Valley',
    characteristics: ['armor'],
    description: 'contains maps od the valley',
};

const magicItemMockPt: MagicItem = {
    name: 'História do Vale',
    characteristics: ['armadura'],
    description: 'contém todos os mapas do vale',
};

const itemsMocks: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: magicItemMockEn,
        pt: magicItemMockPt,
    },
    description: 'Mock an instance of Item',
};

export default itemsMocks;
