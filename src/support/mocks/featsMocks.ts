import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { Feat } from 'src/schemas/featsValidationSchema';
import Mock from 'src/types/Mock';

const featInstanceEn: Feat = {
    name: 'Grappler',
    prerequisite: 'Strength 13 or higher',
    description: 'Several skills',
    benefits: ['advantage on attack rolls'],
};

const featInstancePt: Feat = {
    name: 'Lutador',
    prerequisite: 'Força 13 ou superior',
    description: 'Diversas habilidades',
    benefits: ['vantagem em jogadas de ataque'],
};

const feat: Mock = {
    instance: {
        _id: generateNewMongoID(),
        en: featInstanceEn,
        pt: featInstancePt,
    },
    description: 'Mock an instance of a RPG feat',
};

export default feat;
