import { DnDMagicItem } from '@tablerise/database-management';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const magicItemMockEn: DnDMagicItem = {
    name: 'History of Valley',
    characteristics: ['armor'],
    description: 'contains maps od the valley',
};

const magicItemMockPt: DnDMagicItem = {
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
