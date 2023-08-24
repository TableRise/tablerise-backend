import { DnDFeat } from '@tablerise/database-management';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Mock from 'src/types/Mock';

const featInstanceEn: DnDFeat = {
    name: 'Grappler',
    prerequisite: 'Strength 13 or higher',
    description: 'Several skills',
    benefits: ['advantage on attack rolls'],
};

const featInstancePt: DnDFeat = {
    name: 'Lutador',
    prerequisite: 'Força 13 ou superior',
    description: 'Diversas habilidades',
    benefits: ['vantagem em jogadas de ataque'],
};

const feat: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: featInstanceEn,
        pt: featInstancePt,
    },
    description: 'Mock an instance of a RPG feat',
};

export default feat;
