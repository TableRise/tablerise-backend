import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import Mock from 'src/types/Mock';

const backgroundMockEn: Background = {
    name: 'Insane',
    description: 'Someone that lost his mental health',
    skillProficiences: ['perception', 'wisdom'],
    characteristics: {
        name: 'Crazy Defensor',
        description: 'A crazy defensor is a creature that defends the crazyness',
        suggested: {
            personalityTrait: ['crazy creature'],
            ideal: ['kill everything'],
            bond: ['some bond'],
            flaw: ['too much beautiful'],
        },
    },
    languages: [],
    equipment: [],
};

const backgroundMockPt: Background = {
    name: 'Insano',
    description: 'Alguem que perdeu sua sanidade',
    skillProficiences: ['percepção', 'sabedoria'],
    characteristics: {
        name: 'Defensor Louco',
        description: 'Um defensor louco é uma criatura que defende a loucura',
        suggested: {
            personalityTrait: ['criatura louca'],
            ideal: ['matar tudo'],
            bond: ['alguma ligação'],
            flaw: ['muita beleza'],
        },
    },
    languages: [],
    equipment: [],
};

const background: Mock = {
    instance: {
        _id: generateNewMongoID(),
        active: true,
        en: backgroundMockEn,
        pt: backgroundMockPt,
    },
    description: 'Mock an instance of a RPG background',
};

export default background;
